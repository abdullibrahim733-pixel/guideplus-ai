import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { Species } from './models/Species';
import { ParkFee } from './models/ParkFee';
import { EmergencyContact } from './models/EmergencyContact';
import { TranslationHistory } from './models/TranslationHistory';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'guideplusai',
  jsi: true, // Use JSI for 2-3x performance boost on Android
  onSetUpError: (error) => console.error('DB Setup Error:', error),
});

export const database = new Database({
  adapter,
  modelClasses: [Species, ParkFee, EmergencyContact, TranslationHistory],
});
