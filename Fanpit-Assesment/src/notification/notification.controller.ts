import { Controller, Get, Post, Param, Query, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(@Query() query: any, @Req() req) {
    return this.notificationService.findAll({
      ...query,
      userId: req.user.sub
    });
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req) {
    const count = await this.notificationService.getUnreadCount(req.user.sub);
    return { count };
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Post('mark-all-read')
  async markAllAsRead(@Req() req) {
    await this.notificationService.markAllAsRead(req.user.sub);
    return { success: true };
  }
}
