import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Space', required: true })
  space: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true, min: 1 })
  seats: number;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  })
  status: string;

  @Prop({ type: String })
  orderId: string;

  @Prop({ type: String })
  paymentId: string;

  @Prop({ type: String })
  razorpayOrderId: string;

  @Prop({ type: String })
  razorpayPaymentId: string;

  @Prop({ type: String })
  razorpaySignature: string;

  @Prop({ type: String })
  cancellationReason: string;

  @Prop({ type: Date })
  cancelledAt: Date;

  @Prop({ type: Number })
  refundAmount: number;

  @Prop({ type: String })
  notes: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);