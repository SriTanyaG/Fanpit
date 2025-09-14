import { Controller, Post, Get, Body, Req, Param, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Attendees leave comments
  @Post()
  @Roles('attendee')
  create(@Req() req, @Body() body: { spaceId: string; text: string; rating: number }) {
    return this.commentService.create({
      user: req.user.userId,
      space: body.spaceId,
      text: body.text,
      rating: body.rating,
    });
  }

  // Get all comments for a space
  @Get(':spaceId')
  findBySpace(@Param('spaceId') spaceId: string) {
    return this.commentService.findBySpace(spaceId);
  }
}
