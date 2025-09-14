import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Roles('attendee')
  async create(@Body() body: any, @Req() req) {
    return this.reviewService.create({
      ...body,
      user: req.user.sub
    });
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.reviewService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Put(':id')
  @Roles('attendee')
  async update(@Param('id') id: string, @Body() body: any, @Req() req) {
    const review = await this.reviewService.findOne(id);
    
    // Only allow owner or admin to update
    if (req.user.role !== 'admin' && review.user.toString() !== req.user.sub) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    return this.reviewService.update(id, body);
  }

  @Delete(':id')
  @Roles('attendee', 'admin')
  async remove(@Param('id') id: string, @Req() req) {
    const review = await this.reviewService.findOne(id);
    
    // Only allow owner or admin to delete
    if (req.user.role !== 'admin' && review.user.toString() !== req.user.sub) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    return this.reviewService.remove(id);
  }

  @Get('space/:spaceId/rating')
  async getSpaceRating(@Param('spaceId') spaceId: string) {
    return this.reviewService.getAverageRating(spaceId);
  }
}
