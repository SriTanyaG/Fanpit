import { z } from 'zod';

// Base schemas for nested objects
const locationSchema = z.object({
  coordinates: z.tuple([
    z.number().min(-180).max(180), // longitude
    z.number().min(-90).max(90)    // latitude
  ]),
});

const peakHourSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startHour: z.number().min(0).max(23),
  endHour: z.number().min(0).max(23),
  multiplier: z.number().min(1),
}).refine(data => data.startHour < data.endHour, {
  message: "Start hour must be before end hour"
});

const timeBlockSchema = z.object({
  hours: z.number().positive(),
  price: z.number().nonnegative(),
  description: z.string().optional(),
});

const promoCodeSchema = z.object({
  code: z.string().min(3),
  discountPercentage: z.number().min(0).max(100),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  maxUses: z.number().positive(),
}).refine(data => new Date(data.validFrom) < new Date(data.validUntil), {
  message: "Valid from must be before valid until"
});

const specialEventSchema = z.object({
  name: z.string().min(1),
  date: z.string().datetime(),
  price: z.number().nonnegative(),
  description: z.string().optional(),
});

// Main space schema
export const createSpaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(1, "Address is required"),
  location: locationSchema,
  capacity: z.number().positive("Capacity must be positive"),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url("Invalid image URL")).default([]),
  type: z.enum(["event", "experience"]),
  
  // Pricing fields
  isFree: z.boolean().default(false),
  basePrice: z.number().nonnegative(),
  dayRate: z.number().nonnegative(),
  peakHours: z.array(peakHourSchema).default([]),
  timeBlocks: z.array(timeBlockSchema).default([]),
  monthlyPassPrice: z.number().nonnegative().optional(),
  promoCodes: z.array(promoCodeSchema).default([]),
  specialEvents: z.array(specialEventSchema).default([]),
  
  // Reservation Workflow fields
  dynamicPricing: z.boolean().default(false),
  minBookingDuration: z.number().positive().default(1),
  maxBookingDuration: z.number().positive().default(24),
  advanceBookingDays: z.number().positive().default(30),
  cancellationPolicy: z.enum(['24h', '48h', '7d', 'no']).default('24h'),
  availabilityCalendar: z.record(z.any()).default({}),
}).refine(data => {
  if (!data.isFree) {
    return data.basePrice > 0 || data.dayRate > 0;
  }
  return true;
}, {
  message: "Either base price or day rate must be set for non-free spaces"
});

export type CreateSpaceDto = z.infer<typeof createSpaceSchema>;

// Update schema - make all fields optional
export const updateSpaceSchema = createSpaceSchema.partial();
export type UpdateSpaceDto = z.infer<typeof updateSpaceSchema>;