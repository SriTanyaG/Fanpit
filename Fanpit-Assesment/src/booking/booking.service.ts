import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Space, SpaceDocument } from '../space/schemas/space.schema';
import { User, UserDocument } from '../user/schemas/user.schema';

export interface CreateBookingDto {
  spaceId: string;
  date: string;
  startTime: string;
  endTime: string;
  seats: number;
  amount: number;
  orderId?: string;
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  notes?: string;
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  userId?: string;
  spaceId?: string;
}

export interface PaginatedBookings {
  items: Booking[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Space.name) private spaceModel: Model<SpaceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const { spaceId, date, startTime, endTime, seats, amount, ...paymentData } = createBookingDto;

    // Verify space exists
    const space = await this.spaceModel.findById(spaceId);
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    // Verify user exists
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check availability
    const isAvailable = await this.checkAvailability(spaceId, date, startTime, endTime, seats);
    if (!isAvailable) {
      throw new BadRequestException('Space is not available for the selected time and seats');
    }

    const booking = new this.bookingModel({
      user: userId,
      space: spaceId,
      date: new Date(date),
      startTime,
      endTime,
      seats,
      amount,
      status: 'pending',
      ...paymentData,
    });

    return await booking.save();
  }

  async getBookings(filters: BookingFilters = {}): Promise<PaginatedBookings> {
    const {
      page = 1,
      limit = 10,
      status,
      userId,
      spaceId,
    } = filters;

    const query: any = {};
    if (status) query.status = status;
    if (userId) query.user = userId;
    if (spaceId) query.space = spaceId;

    const skip = (page - 1) * limit;

    const [bookings, totalItems] = await Promise.all([
      this.bookingModel
        .find(query)
        .populate('user', 'name email')
        .populate('space', 'name location images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookingModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: bookings,
      totalItems,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('user', 'name email')
      .populate('space', 'name location images')
      .exec();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async getMyBookings(userId: string, filters: Omit<BookingFilters, 'userId'> = {}): Promise<PaginatedBookings> {
    return this.getBookings({ ...filters, userId });
  }

  async updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled', cancellationReason?: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    booking.status = status;
    if (status === 'cancelled') {
      booking.cancellationReason = cancellationReason || '';
      booking.cancelledAt = new Date();
      // Calculate refund amount (you might want to implement refund logic here)
      booking.refundAmount = booking.amount;
    }

    return await booking.save();
  }

  async cancelBooking(id: string, userId: string, cancellationReason?: string): Promise<Booking> {
    const booking = await this.bookingModel.findOne({ _id: id, user: userId });
    if (!booking) {
      throw new NotFoundException('Booking not found or you do not have permission to cancel this booking');
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestException('Booking is already cancelled');
    }

    return this.updateBookingStatus(id, 'cancelled', cancellationReason);
  }

  async checkAvailability(spaceId: string, date: string, startTime: string, endTime: string, seats: number): Promise<boolean> {
    const bookingDate = new Date(date);
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    // Check for overlapping bookings
    const overlappingBookings = await this.bookingModel.find({
      space: spaceId,
      date: {
        $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
        $lt: new Date(bookingDate.setHours(23, 59, 59, 999)),
      },
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } },
          ],
        },
      ],
    });

    // Get space capacity
    const space = await this.spaceModel.findById(spaceId);
    if (!space) return false;

    // Calculate total booked seats for the time slot
    const totalBookedSeats = overlappingBookings.reduce((total, booking) => total + booking.seats, 0);

    // Check if there's enough capacity
    return (totalBookedSeats + seats) <= (space.capacity || 0);
  }

  async getBookingStats(userId?: string): Promise<any> {
    const matchQuery = userId ? { user: userId } : {};
    
    const stats = await this.bookingModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const result = {
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      totalRevenue: 0,
    };

    stats.forEach(stat => {
      result.total += stat.count;
      result[stat._id] = stat.count;
      if (stat._id === 'confirmed') {
        result.totalRevenue += stat.totalAmount;
      }
    });

    return result;
  }
}