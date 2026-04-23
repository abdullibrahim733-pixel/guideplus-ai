import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'species',
      columns: [
        { name: 'common_name_en', type: 'string' },
        { name: 'common_name_sw', type: 'string' },
        { name: 'scientific_name', type: 'string' },
        { name: 'family', type: 'string' },
        { name: 'category', type: 'string' }, // mammal, bird, reptile, plant
        { name: 'iucn_status', type: 'string' }, // LC, NT, VU, EN, CR, EX
        { name: 'habitat', type: 'string' },
        { name: 'pro_facts_json', type: 'string' }, // JSON array of tip-worthy facts
        { name: 'translations_json', type: 'string' },// {zh, es, fr, de, ...}
        { name: 'tflite_class_index', type: 'number' },// model output class index
        { name: 'image_filename', type: 'string', isOptional: true },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'park_fees',
      columns: [
        { name: 'park_name', type: 'string' },
        { name: 'authority', type: 'string' }, // TANAPA, NCAA
        { name: 'visitor_category', type: 'string' },// adult, child, student
        { name: 'resident_usd', type: 'number' },
        { name: 'nonresident_usd', type: 'number' },
        { name: 'vehicle_fee_usd', type: 'number' },
        { name: 'valid_from', type: 'number' },
        { name: 'valid_until', type: 'number', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'emergency_contacts',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'category', type: 'string' }, // medical, ranger, police, evac
        { name: 'phone_primary', type: 'string' },
        { name: 'phone_secondary', type: 'string', isOptional: true },
        { name: 'location', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'translation_history',
      columns: [
        { name: 'original_text', type: 'string' },
        { name: 'translated_text', type: 'string' },
        { name: 'source_lang', type: 'string' },
        { name: 'target_lang', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'was_offline', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'vehicle_checklists',
      columns: [
        { name: 'vehicle_id', type: 'string' },
        { name: 'checklist_date', type: 'number' },
        { name: 'items_json', type: 'string' }, // JSON: [{item, status, notes}]
        { name: 'completed_by', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
      ],
    }),
  ],
});
