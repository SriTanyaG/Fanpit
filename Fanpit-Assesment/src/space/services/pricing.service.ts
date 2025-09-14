import { Injectable } from '@nestjs/common';
import { Space, PromoCode, PeakHour, TimeBlock } from '../schemas/space.schema';

interface PriceBreakdown {
  basePrice: number;
  peakMultiplier: number;
  timeBlockDiscount: number;
  promoDiscount: number;
  finalPrice: number;
  breakdown: {
    description: string;
    amount: number;
  }[];
}

@Injectable()
export class PricingService {
  calculatePrice(
    space: Space,
    startTime: Date,
    endTime: Date,
    promoCode?: string
  ): PriceBreakdown {
    if (space.isFree) {
      return this.createPriceBreakdown(0);
    }

    const hours = this.calculateHours(startTime, endTime);
    const isFullDay = hours >= 24;

    // Start with base calculation
    let basePrice = isFullDay ? space.dayRate : space.basePrice * hours;
    const breakdown = [{
      description: isFullDay ? 'Day rate' : `Base rate (${hours} hours)`,
      amount: basePrice
    }];

    // Apply peak hour multiplier if applicable
    const peakMultiplier = this.calculatePeakMultiplier(space.peakHours, startTime, endTime);
    if (peakMultiplier > 1) {
      const peakIncrease = basePrice * (peakMultiplier - 1);
      basePrice += peakIncrease;
      breakdown.push({
        description: 'Peak hour adjustment',
        amount: peakIncrease
      });
    }

    // Check for time block discounts
    const timeBlockDiscount = this.calculateTimeBlockDiscount(space.timeBlocks, hours, basePrice);
    if (timeBlockDiscount > 0) {
      breakdown.push({
        description: 'Time block discount',
        amount: -timeBlockDiscount
      });
    }

    // Apply promo code if valid
    const promoDiscount = this.calculatePromoDiscount(space.promoCodes, promoCode, basePrice);
    if (promoDiscount > 0) {
      breakdown.push({
        description: 'Promo code discount',
        amount: -promoDiscount
      });
    }

    // Check for special event pricing
    const specialEventPrice = this.checkSpecialEventPrice(space, startTime);
    if (specialEventPrice !== null) {
      return this.createPriceBreakdown(specialEventPrice, [{
        description: 'Special event price',
        amount: specialEventPrice
      }]);
    }

    const finalPrice = basePrice - timeBlockDiscount - promoDiscount;

    return {
      basePrice: space.basePrice,
      peakMultiplier,
      timeBlockDiscount,
      promoDiscount,
      finalPrice,
      breakdown
    };
  }

  private calculateHours(startTime: Date, endTime: Date): number {
    const diffMs = endTime.getTime() - startTime.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60));
  }

  private calculatePeakMultiplier(peakHours: PeakHour[], startTime: Date, endTime: Date): number {
    if (!peakHours.length) return 1;

    const startHour = startTime.getHours();
    const dayOfWeek = startTime.getDay();

    const peakHour = peakHours.find(ph => 
      ph.dayOfWeek === dayOfWeek &&
      startHour >= ph.startHour &&
      startHour < ph.endHour
    );

    return peakHour ? peakHour.multiplier : 1;
  }

  private calculateTimeBlockDiscount(timeBlocks: TimeBlock[], hours: number, basePrice: number): number {
    if (!timeBlocks.length) return 0;

    const applicableBlock = timeBlocks
      .filter(block => block.hours <= hours)
      .sort((a, b) => b.hours - a.hours)[0];

    if (!applicableBlock) return 0;

    const normalPrice = basePrice;
    const discountedPrice = applicableBlock.price;
    return Math.max(0, normalPrice - discountedPrice);
  }

  private calculatePromoDiscount(promoCodes: PromoCode[], code: string | undefined, basePrice: number): number {
    if (!code || !promoCodes.length) return 0;

    const promoCode = promoCodes.find(pc => 
      pc.code === code &&
      pc.currentUses < pc.maxUses &&
      new Date() >= new Date(pc.validFrom) &&
      new Date() <= new Date(pc.validUntil)
    );

    if (!promoCode) return 0;

    return (basePrice * promoCode.discountPercentage) / 100;
  }

  private checkSpecialEventPrice(space: Space, date: Date): number | null {
    if (!space.specialEvents.length) return null;

    const event = space.specialEvents.find(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });

    return event ? event.price : null;
  }

  private createPriceBreakdown(finalPrice: number, breakdown: { description: string; amount: number; }[] = []): PriceBreakdown {
    return {
      basePrice: finalPrice,
      peakMultiplier: 1,
      timeBlockDiscount: 0,
      promoDiscount: 0,
      finalPrice,
      breakdown
    };
  }
}

