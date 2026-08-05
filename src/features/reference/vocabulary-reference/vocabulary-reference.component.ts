import { Component, computed, inject, input } from '@angular/core';

import { SettingsService } from '../../../core/services/settings.service';
import { VocabularyEngine } from '../../../core/engines/vocabulary.engine';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { Synonym } from '../../../core/models/synonym.model';
import { Antonym } from '../../../core/models/antonym.model';
import { OneWord } from '../../../core/models/one-word.model';
import { Idiom } from '../../../core/models/idiom.model';
import { ReviewService } from '../../../core/services/review.service';
import { BookmarkService } from '../../../core/services/bookmark.service';

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
  private bookmarkService = inject(BookmarkService);

  private removedBookmarks = new Set<unknown>();

  public PracticeMode = PracticeMode;

  referenceTab = input<'all' | 'weak' | 'bookmark'>();

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
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarks<Synonym>(this.mode);

      case 'weak':
        return this.reviewService.getPendingQuestions<Synonym>(this.mode);

      default:
        return this.vocabularyEngine.getSynonymsReference();
    }
  }

  get antonyms(): Antonym[] {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarks<Antonym>(this.mode);

      case 'weak':
        return this.reviewService.getPendingQuestions<Antonym>(this.mode);

      default:
        return this.vocabularyEngine.getAntonymsReference();
    }
  }

  get oneWords(): OneWord[] {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarks<OneWord>(this.mode);

      case 'weak':
        return this.reviewService.getPendingQuestions<OneWord>(this.mode);

      default:
        return this.vocabularyEngine.getOneWordsReference();
    }
  }

  get idioms(): Idiom[] {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarks<Idiom>(this.mode);

      case 'weak':
        return this.reviewService.getPendingQuestions<Idiom>(this.mode);

      default:
        return this.vocabularyEngine.getIdiomsReference();
    }
  }

  toggleBookmark(question: Synonym | Antonym | OneWord | Idiom): void {
    const entry = {
      id: this.getQuestionId(question),
      mode: this.mode,
      question,
    };

    if (this.removedBookmarks.has(question)) {
      this.bookmarkService.add(entry);
      this.removedBookmarks.delete(question);
    } else {
      this.bookmarkService.remove(entry);
      this.removedBookmarks.add(question);
    }
  }

  private getQuestionId(question: Synonym | Antonym | OneWord | Idiom): string {
    switch (this.mode) {
      case PracticeMode.Synonyms:
        return `synonym:${(question as Synonym).word}`;

      case PracticeMode.Antonyms:
        return `antonym:${(question as Antonym).word}`;

      case PracticeMode.OneWord:
        return `one-word:${(question as OneWord).word}`;

      case PracticeMode.Idioms:
        return `idiom:${(question as Idiom).idiom}`;

      default:
        return '';
    }
  }

  isRemoved(question: unknown): boolean {
    return this.removedBookmarks.has(question);
  }

  formatExample(word: string, example: string): string {
    const forms = [word];

    if (word.endsWith('e')) {
      const stem = word.slice(0, -1);

      forms.push(`${stem}ing`);
      forms.push(`${stem}ed`);
    } else {
      forms.push(`${word}ing`);
      forms.push(`${word}ed`);
    }

    forms.push(`${word}s`);
    forms.push(`${word}es`);

    const regex = new RegExp(`\\b(${forms.join('|')})\\b`, 'gi');

    return example.replace(regex, '<u><strong>$1</strong></u>');
  }
}
