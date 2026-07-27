import { Component, inject } from '@angular/core';

import { SettingsService } from '../../../core/services/settings.service';
import { VocabularyEngine } from '../../../core/engines/vocabulary.engine';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { Synonym } from '../../../core/models/synonym.model';
import { Antonym } from '../../../core/models/antonym.model';
import { OneWord } from '../../../core/models/one-word.model';
import { Idiom } from '../../../core/models/idiom.model';

@Component({
  selector: 'app-vocabulary-reference',
  standalone: true,
  imports: [],
  templateUrl: './vocabulary-reference.component.html',
  styleUrl: './vocabulary-reference.component.scss',
})
export class VocabularyReferenceComponent {
  private settingsService = inject(SettingsService);

  synonyms: Synonym[] = [];
  antonyms: Antonym[] = [];
  oneWords: OneWord[] = [];
  idioms: Idiom[] = [];

  constructor(private vocabularyEngine: VocabularyEngine) {
    switch (this.settingsService.settings().selectedExercise?.mode) {
      case PracticeMode.Synonyms:
        this.synonyms = this.vocabularyEngine.getSynonymsReference();
        break;

      case PracticeMode.Antonyms:
        this.antonyms = this.vocabularyEngine.getAntonymsReference();
        break;

      case PracticeMode.OneWord:
        this.oneWords = this.vocabularyEngine.getOneWordsReference();
        break;

      case PracticeMode.Idioms:
        this.idioms = this.vocabularyEngine.getIdiomsReference();
        break;
    }
  }
}
