import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Space, SpaceDocument } from './schemas/space.schema';

@Injectable()
export class SpaceService {
  constructor(@InjectModel(Space.name) private spaceModel: Model<SpaceDocument>) {}

  // Create a new space
  async create(createSpaceDto: any): Promise<Space> {
    const newSpace = new this.spaceModel(createSpaceDto);
    return newSpace.save();
  }

  // Get all spaces with filters and pagination
  async findAll(query: any): Promise<{ items: Space[]; total: number; page: number; limit: number; totalPages: number }> {
    const filter: any = {};
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter by type (event/experience)
    if (query.type) {
      filter.type = query.type;
    }

    // Search by name (case-insensitive)
    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }

    // Filter by active status
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }

    const [items, total] = await Promise.all([
      this.spaceModel.find(filter)
        .populate('owner', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.spaceModel.countDocuments(filter)
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }


  // Get one space by ID
  async findOne(id: string): Promise<Space> {
    const space = await this.spaceModel.findById(id)
      .populate('owner', 'name email')
      .exec();
    if (!space) throw new NotFoundException(`Space with id ${id} not found`);
    return space;
  }

  // Get spaces by owner with pagination and filters
  async findByOwner(ownerId: string, query: any = {}): Promise<{ items: Space[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { owner: ownerId };

    // Add search filter
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { address: { $regex: query.search, $options: 'i' } }
      ];
    }

    // Add type filter
    if (query.type) {
      filter.type = query.type;
    }

    // Add capacity filter
    if (query.capacity) {
      filter.capacity = { $gte: parseInt(query.capacity) };
    }

    const [items, total] = await Promise.all([
      this.spaceModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.spaceModel.countDocuments(filter)
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Update space by ID
  async update(id: string, updateSpaceDto: any): Promise<Space> {
    const updatedSpace = await this.spaceModel.findByIdAndUpdate(id, updateSpaceDto, { new: true });
    if (!updatedSpace) throw new NotFoundException(`Space with id ${id} not found`);
    return updatedSpace;
  }

  // Delete space by ID
  async remove(id: string): Promise<void> {
    const result = await this.spaceModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException(`Space with id ${id} not found`);
  }
}
