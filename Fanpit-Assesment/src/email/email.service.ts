import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { Space } from '../space/schemas/space.schema';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendBookingConfirmation(
    user: User,
    space: Space,
    bookingDetails: {
      date: Date;
      seats: number;
      amount: number;
      orderId: string;
    }
  ) {
    const template = `
      <h1>Booking Confirmation</h1>
      <p>Dear ${user.name},</p>
      <p>Your booking has been confirmed for:</p>
      <div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 5px;">
        <h2>${space.name}</h2>
        <p><strong>Date:</strong> ${format(bookingDetails.date, 'PPP')}</p>
        <p><strong>Time:</strong> ${format(bookingDetails.date, 'p')}</p>
        <p><strong>Seats:</strong> ${bookingDetails.seats}</p>
        <p><strong>Amount Paid:</strong> ₹${bookingDetails.amount}</p>
        <p><strong>Booking ID:</strong> ${bookingDetails.orderId}</p>
        <p><strong>Address:</strong> ${space.address}</p>
      </div>
      <p>Important Information:</p>
      <ul>
        <li>Please arrive 15 minutes before your scheduled time</li>
        <li>Bring a valid ID proof</li>
        <li>Follow all venue guidelines and safety protocols</li>
      </ul>
      <p>For any queries, please contact us at support@fanpit.com</p>
    `;

    await this.transporter.sendMail({
      from: `"Fanpit" <${this.configService.get<string>('SMTP_FROM')}>`,
      to: user.email,
      subject: 'Booking Confirmation - Fanpit',
      html: template,
    });
  }

  async sendBookingCancellation(
    user: User,
    space: Space,
    bookingDetails: {
      date: Date;
      orderId: string;
      refundAmount?: number;
    }
  ) {
    const template = `
      <h1>Booking Cancellation</h1>
      <p>Dear ${user.name},</p>
      <p>Your booking has been cancelled for:</p>
      <div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 5px;">
        <h2>${space.name}</h2>
        <p><strong>Date:</strong> ${format(bookingDetails.date, 'PPP')}</p>
        <p><strong>Time:</strong> ${format(bookingDetails.date, 'p')}</p>
        <p><strong>Booking ID:</strong> ${bookingDetails.orderId}</p>
      </div>
      ${bookingDetails.refundAmount ? `
        <p>A refund of ₹${bookingDetails.refundAmount} will be processed within 5-7 business days.</p>
      ` : ''}
      <p>For any queries, please contact us at support@fanpit.com</p>
    `;

    await this.transporter.sendMail({
      from: `"Fanpit" <${this.configService.get<string>('SMTP_FROM')}>`,
      to: user.email,
      subject: 'Booking Cancellation - Fanpit',
      html: template,
    });
  }

  async sendSpaceCreationConfirmation(
    user: User,
    space: Space
  ) {
    const template = `
      <h1>Space Listed Successfully</h1>
      <p>Dear ${user.name},</p>
      <p>Your space has been successfully listed on Fanpit:</p>
      <div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 5px;">
        <h2>${space.name}</h2>
        <p><strong>Type:</strong> ${space.type}</p>
        <p><strong>Capacity:</strong> ${space.capacity} people</p>
        <p><strong>Address:</strong> ${space.address}</p>
        <p><strong>Base Price:</strong> ₹${space.basePrice}/hour</p>
        ${space.dayRate ? `<p><strong>Day Rate:</strong> ₹${space.dayRate}</p>` : ''}
      </div>
      <p>You can manage your space from your dashboard:</p>
      <p><a href="${this.configService.get<string>('FRONTEND_URL')}/dashboard/spaces">Manage Space</a></p>
      <p>For any queries, please contact us at support@fanpit.com</p>
    `;

    await this.transporter.sendMail({
      from: `"Fanpit" <${this.configService.get<string>('SMTP_FROM')}>`,
      to: user.email,
      subject: 'Space Listed Successfully - Fanpit',
      html: template,
    });
  }

  async sendBookingNotificationToOwner(
    owner: User,
    space: Space,
    bookingDetails: {
      date: Date;
      seats: number;
      amount: number;
      orderId: string;
      customerName: string;
    }
  ) {
    const template = `
      <h1>New Booking Received</h1>
      <p>Dear ${owner.name},</p>
      <p>You have received a new booking for:</p>
      <div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 5px;">
        <h2>${space.name}</h2>
        <p><strong>Date:</strong> ${format(bookingDetails.date, 'PPP')}</p>
        <p><strong>Time:</strong> ${format(bookingDetails.date, 'p')}</p>
        <p><strong>Seats:</strong> ${bookingDetails.seats}</p>
        <p><strong>Amount:</strong> ₹${bookingDetails.amount}</p>
        <p><strong>Booking ID:</strong> ${bookingDetails.orderId}</p>
        <p><strong>Customer:</strong> ${bookingDetails.customerName}</p>
      </div>
      <p>You can view the booking details in your dashboard:</p>
      <p><a href="${this.configService.get<string>('FRONTEND_URL')}/dashboard/bookings">View Booking</a></p>
      <p>For any queries, please contact us at support@fanpit.com</p>
    `;

    await this.transporter.sendMail({
      from: `"Fanpit" <${this.configService.get<string>('SMTP_FROM')}>`,
      to: owner.email,
      subject: 'New Booking Received - Fanpit',
      html: template,
    });
  }
}

