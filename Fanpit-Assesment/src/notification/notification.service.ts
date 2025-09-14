import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>
  ) {}

  async create(createNotificationDto: any): Promise<Notification> {
    const newNotification = new this.notificationModel(createNotificationDto);
    return newNotification.save();
  }

  async findAll(query: any = {}): Promise<{ items: Notification[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };
    if (query.userId) {
      filter.user = query.userId;
    }
    if (query.type) {
      filter.type = query.type;
    }
    if (query.isRead !== undefined) {
      filter.isRead = query.isRead;
    }

    const [items, total] = await Promise.all([
      this.notificationModel.find(filter)
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(filter)
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id)
      .populate('user', 'name')
      .exec();
    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    return notification;
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      user: userId,
      isRead: false,
      isActive: true
    });
  }

  async createBookingNotification(booking: any): Promise<void> {
    // Notify user about booking confirmation
    await this.create({
      user: booking.user,
      title: 'Booking Confirmed',
      message: `Your booking for ${booking.space.name} on ${booking.date} has been confirmed.`,
      type: 'booking',
      refId: booking._id,
      refModel: 'Booking'
    });

    // Notify space owner about new booking
    await this.create({
      user: booking.space.owner,
      title: 'New Booking',
      message: `A new booking has been made for ${booking.space.name} on ${booking.date}.`,
      type: 'booking',
      refId: booking._id,
      refModel: 'Booking'
    });
  }

  async createReviewNotification(review: any): Promise<void> {
    // Notify space owner about new review
    await this.create({
      user: review.space.owner,
      title: 'New Review',
      message: `A new review has been posted for ${review.space.name}.`,
      type: 'review',
      refId: review._id,
      refModel: 'Review'
    });
  }
}
