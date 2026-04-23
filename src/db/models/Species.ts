import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class Species extends Model {
  static table = 'species';

  @field('common_name_en') commonNameEn: string;
  @field('common_name_sw') commonNameSw: string;
  @field('scientific_name') scientificName: string;
  @field('family') family: string;
  @field('category') category: string;
  @field('iucn_status') iucnStatus: string;
  @field('habitat') habitat: string;
  @field('pro_facts_json') proFactsJson: string;
  @field('translations_json') translationsJson: string;
  @field('tflite_class_index') tfliteClassIndex: number;
  @field('image_filename') imageFilename?: string;
  @date('updated_at') updatedAt: Date;

  // Helper getters
  get proFacts() {
    return JSON.parse(this.proFactsJson);
  }

  get translations() {
    return JSON.parse(this.translationsJson);
  }

  set proFacts(facts: string[]) {
    this.proFactsJson = JSON.stringify(facts);
  }

  set translations(translations: Record<string, string>) {
    this.translationsJson = JSON.stringify(translations);
  }
}
