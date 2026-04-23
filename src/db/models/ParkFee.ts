import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class ParkFee extends Model {
  static table = 'park_fees';

  @field('park_name') parkName: string;
  @field('authority') authority: string;
  @field('visitor_category') visitorCategory: string;
  @field('resident_usd') residentUsd: number;
  @field('nonresident_usd') nonresidentUsd: number;
  @field('vehicle_fee_usd') vehicleFeeUsd: number;
  @date('valid_from') validFrom: Date;
  @date('valid_until') validUntil?: Date;
  @field('notes') notes?: string;
  @date('updated_at') updatedAt: Date;
}
