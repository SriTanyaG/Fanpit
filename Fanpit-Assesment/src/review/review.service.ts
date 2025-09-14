import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>
  ) {}

  async create(createReviewDto: any): Promise<Review> {
    const newReview = new this.reviewModel(createReviewDto);
    return newReview.save();
  }

  async findAll(query: any = {}): Promise<{ items: Review[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };
    if (query.spaceId) {
      filter.space = query.spaceId;
    }
    if (query.userId) {
      filter.user = query.userId;
    }

    const [items, total] = await Promise.all([
      this.reviewModel.find(filter)
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.reviewModel.countDocuments(filter)
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id)
      .populate('user', 'name')
      .exec();
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: any): Promise<Review> {
    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      id,
      updateReviewDto,
      { new: true }
    );
    if (!updatedReview) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return updatedReview;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
  }

  async getAverageRating(spaceId: string): Promise<{ rating: number; count: number }> {
    const result = await this.reviewModel.aggregate([
      { $match: { space: spaceId, isActive: true } },
      {
        $group: {
          _id: null,
          rating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]).exec();

    if (result.length === 0) {
      return { rating: 0, count: 0 };
    }

    return {
      rating: Math.round(result[0].rating * 10) / 10,
      count: result[0].count
    };
  }
}
