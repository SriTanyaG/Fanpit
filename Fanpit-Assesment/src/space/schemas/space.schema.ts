import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SpaceDocument = Space & Document;

// Pricing types
export interface TimeBlock {
  hours: number;
  price: number;
  description: string;
}

export interface PeakHour {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startHour: number; // 0-23
  endHour: number; // 0-23
  multiplier: number;
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  validFrom: Date;
  validUntil: Date;
  maxUses: number;
  currentUses: number;
}

export interface SpecialEvent {
  name: string;
  date: Date;
  price: number;
  description: string;
}

export interface Location {
  type: { type: String, default: 'Point' };
  coordinates: [number, number]; // [longitude, latitude]
}

@Schema({ timestamps: true })
export class Space {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  address: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: Location;

  @Prop({ required: true, min: 1 })
  capacity: number;

  @Prop([String])
  amenities: string[];

  @Prop([String])
  images: string[];

  @Prop({ required: true, enum: ['event', 'experience'] })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  // Pricing fields
  @Prop({ type: Boolean, default: false })
  isFree: boolean;

  @Prop({ type: Number, required: true, min: 0 })
  basePrice: number; // Base price per hour

  @Prop({ type: Number, required: true, min: 0 })
  dayRate: number; // Full day rate

  @Prop([{
    dayOfWeek: { type: Number, min: 0, max: 6 },
    startHour: { type: Number, min: 0, max: 23 },
    endHour: { type: Number, min: 0, max: 23 },
    multiplier: { type: Number, min: 1 }
  }])
  peakHours: PeakHour[];

  @Prop([{
    hours: { type: Number, required: true },
    price: { type: Number, required: true },
    description: String
  }])
  timeBlocks: TimeBlock[];

  @Prop({ type: Number })
  monthlyPassPrice: number;

  @Prop([{
    code: { type: String, required: true },
    discountPercentage: { type: Number, required: true, min: 0, max: 100 },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    maxUses: { type: Number, required: true },
    currentUses: { type: Number, default: 0 }
  }])
  promoCodes: PromoCode[];

  @Prop([{
    name: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    description: String
  }])
  specialEvents: SpecialEvent[];

  // Availability fields
  @Prop([{
    date: { type: Date, required: true },
    slots: [{
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
      isBooked: { type: Boolean, default: false },
      price: { type: Number, required: true }
    }]
  }])
  availability: {
    date: Date;
    slots: {
      startTime: Date;
      endTime: Date;
      isBooked: boolean;
      price: number;
    }[];
  }[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  rating: number;

  @Prop({ type: Number, default: 0 })
  reviewCount: number;

  // Reservation Workflow fields
  @Prop({ type: Boolean, default: false })
  dynamicPricing: boolean;

  @Prop({ type: Number, default: 1, min: 1 })
  minBookingDuration: number; // in hours

  @Prop({ type: Number, default: 24, min: 1 })
  maxBookingDuration: number; // in hours

  @Prop({ type: Number, default: 30, min: 1 })
  advanceBookingDays: number; // how many days in advance can be booked

  @Prop({ type: String, enum: ['24h', '48h', '7d', 'no'], default: '24h' })
  cancellationPolicy: string;

  @Prop({ type: Object, default: {} })
  availabilityCalendar: Record<string, any>; // for complex availability rules
}

export const SpaceSchema = SchemaFactory.createForClass(Space);

// Add index for location-based queries
SpaceSchema.index({ location: '2dsphere' });

// Add index for searching
SpaceSchema.index({
  name: 'text',
  description: 'text',
  address: 'text'
});