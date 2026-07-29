import { Component, computed, inject, input } from '@angular/core';

import { SettingsService } from '../../../core/services/settings.service';
import { VocabularyEngine } from '../../../core/engines/vocabulary.engine';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { Synonym } from '../../../core/models/synonym.model';
import { Antonym } from '../../../core/models/antonym.model';
import { OneWord } from '../../../core/models/one-word.model';
import { Idiom } from '../../../core/models/idiom.model';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-vocabulary-reference',
  standalone: true,
  imports: [],
  templateUrl: './vocabulary-reference.component.html',
  styleUrl: './vocabulary-reference.component.scss',
})
export class VocabularyReferenceComponent {
  searchText = input<string>();

  private settingsService = inject(SettingsService);
  private reviewService = inject(ReviewService);
  private vocabularyEngine = inject(VocabularyEngine);

  public PracticeMode = PracticeMode;

  isWeakMode = input<boolean>();

  readonly filteredSynonyms = computed(() => {
    const search = this.searchText()!.trim().toLowerCase();

    // const words = [...this.synonyms].sort((a, b) =>
    //   a.word.localeCompare(b.word),
    // );
    const words = [...this.synonyms];

    if (!search) {
      return words;
    }

    return words.filter(
      (word) =>
        word.word.toLowerCase().includes(search) ||
        word.meaning.toLowerCase().includes(search) ||
        word.synonyms.some((s) => s.toLowerCase().includes(search)),
    );
  });

  readonly filteredAntonyms = computed(() => {
    const search = this.searchText()!.trim().toLowerCase();

    // const words = [...this.antonyms].sort((a, b) =>
    //   a.word.localeCompare(b.word),
    // );
    const words = [...this.antonyms];

    if (!search) {
      return words;
    }

    return words.filter(
      (word) =>
        word.word.toLowerCase().includes(search) ||
        word.meaning.toLowerCase().includes(search) ||
        word.antonyms.some((s) => s.toLowerCase().includes(search)),
    );
  });

  readonly filteredOneWords = computed(() => {
    const search = this.searchText()!.trim().toLowerCase();

    // const words = [...this.oneWords].sort((a, b) =>
    //   a.word.localeCompare(b.word),
    // );
    const words = [...this.oneWords];

    if (!search) {
      return words;
    }

    return words.filter(
      (word) =>
        word.word.toLowerCase().includes(search) ||
        word.phrase.toLowerCase().includes(search),
    );
  });

  readonly filteredIdioms = computed(() => {
    const search = this.searchText()!.trim().toLowerCase();

    // const words = [...this.idioms].sort((a, b) =>
    //   a.idiom.localeCompare(b.idiom),
    // );
    const words = [...this.idioms];

    if (!search) {
      return words;
    }

    return words.filter(
      (word) =>
        word.idiom.toLowerCase().includes(search) ||
        word.meaning.toLowerCase().includes(search),
    );
  });

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  get synonyms(): Synonym[] {
    if (this.isWeakMode()) {
      return this.reviewService.getPendingQuestions<Synonym>(this.mode);
    }

    return this.vocabularyEngine.getSynonymsReference();
  }

  get antonyms(): Antonym[] {
    if (this.isWeakMode()) {
      return this.reviewService.getPendingQuestions<Antonym>(this.mode);
    }

    return this.vocabularyEngine.getAntonymsReference();
  }

  get oneWords(): OneWord[] {
    if (this.isWeakMode()) {
      return this.reviewService.getPendingQuestions<OneWord>(this.mode);
    }

    return this.vocabularyEngine.getOneWordsReference();
  }

  get idioms(): Idiom[] {
    if (this.isWeakMode()) {
      return this.reviewService.getPendingQuestions<Idiom>(this.mode);
    }

    return this.vocabularyEngine.getIdiomsReference();
  }
}
