import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BookingService, type CreateBookingDto, type BookingFilters } from './booking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    try {
      const booking = await this.bookingService.createBooking(createBookingDto, req.user.userId);
      return {
        success: true,
        data: booking,
        message: 'Booking created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async getBookings(@Query() query: any) {
    try {
      const filters: BookingFilters = {
        page: query.page ? parseInt(query.page) : 1,
        limit: query.limit ? parseInt(query.limit) : 10,
        status: query.status,
        userId: query.userId,
        spaceId: query.spaceId,
      };

      const result = await this.bookingService.getBookings(filters);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('my')
  async getMyBookings(@Request() req, @Query() query: any) {
    try {
      const filters: Omit<BookingFilters, 'userId'> = {
        page: query.page ? parseInt(query.page) : 1,
        limit: query.limit ? parseInt(query.limit) : 10,
        status: query.status,
        spaceId: query.spaceId,
      };

      const result = await this.bookingService.getMyBookings(req.user.userId, filters);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('stats')
  async getBookingStats(@Request() req, @Query() query: any) {
    try {
      const userId = query.userId || req.user.userId;
      const stats = await this.bookingService.getBookingStats(userId);
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string) {
    try {
      const booking = await this.bookingService.getBookingById(id);
      return {
        success: true,
        data: booking,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('brand_owner', 'admin')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() body: { status: 'pending' | 'confirmed' | 'cancelled'; cancellationReason?: string },
  ) {
    try {
      const booking = await this.bookingService.updateBookingStatus(
        id,
        body.status,
        body.cancellationReason,
      );
      return {
        success: true,
        data: booking,
        message: `Booking ${body.status} successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id/cancel')
  async cancelBooking(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { cancellationReason?: string },
  ) {
    try {
      const booking = await this.bookingService.cancelBooking(
        id,
        req.user.userId,
        body.cancellationReason,
      );
      return {
        success: true,
        data: booking,
        message: 'Booking cancelled successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get('availability/:spaceId')
  async checkAvailability(
    @Param('spaceId') spaceId: string,
    @Query() query: { date: string; startTime: string; endTime: string; seats: number },
  ) {
    try {
      const { date, startTime, endTime, seats } = query;
      
      if (!date || !startTime || !endTime || !seats) {
        throw new BadRequestException('Missing required parameters: date, startTime, endTime, seats');
      }

      const isAvailable = await this.bookingService.checkAvailability(
        spaceId,
        date,
        startTime,
        endTime,
        parseInt(seats.toString()),
      );

      return {
        success: true,
        data: { available: isAvailable },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}