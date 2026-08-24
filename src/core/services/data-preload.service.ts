import { Injectable } from '@angular/core';

import { StateService } from './state.service';
import { VocabularyDataService } from './vocabulary-data.service';

import { PracticeMode } from '../enums/practice-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class DataPreloadService {
  constructor(private vocabularyDataService: VocabularyDataService) {}

  async preloadForMode(mode?: PracticeMode): Promise<void> {
    switch (mode) {
      case PracticeMode.Synonyms:
        await this.vocabularyDataService.ensureSynonymsLoaded();
        break;

      case PracticeMode.Antonyms:
        await this.vocabularyDataService.ensureAntonymsLoaded();
        break;

      case PracticeMode.OneWord:
        await this.vocabularyDataService.ensureOneWordsLoaded();
        break;

      case PracticeMode.Idioms:
        await this.vocabularyDataService.ensureIdiomsLoaded();
        break;

      case PracticeMode.PhrasalVerbs:
        await this.vocabularyDataService.ensurePhrasalVerbsLoaded();
        break;

      default:
        break;
    }
  }
}
