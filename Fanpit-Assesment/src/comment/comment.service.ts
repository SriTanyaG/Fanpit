import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(data: any): Promise<Comment> {
    const comment = new this.commentModel(data);
    return comment.save();
  }

  async findBySpace(spaceId: string): Promise<Comment[]> {
    return this.commentModel.find({ space: spaceId }).populate('user').exec();
  }
}
