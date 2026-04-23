import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class EmergencyContact extends Model {
  static table = 'emergency_contacts';

  @field('name') name: string;
  @field('category') category: string; // medical, ranger, police, evac
  @field('phone_primary') phonePrimary: string;
  @field('phone_secondary') phoneSecondary?: string;
  @field('location') location: string;
  @field('notes') notes?: string;
  @date('updated_at') updatedAt: Date;
}
