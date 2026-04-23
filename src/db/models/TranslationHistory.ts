import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class TranslationHistory extends Model {
  static table = 'translation_history';

  @field('original_text') originalText: string;
  @field('translated_text') translatedText: string;
  @field('source_lang') sourceLang: string;
  @field('target_lang') targetLang: string;
  @date('created_at') createdAt: Date;
  @field('was_offline') wasOffline: boolean;
}
