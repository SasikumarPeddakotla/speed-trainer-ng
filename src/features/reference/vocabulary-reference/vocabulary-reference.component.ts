import { Component, computed, inject, input, signal } from '@angular/core';

import { SettingsService } from '../../../core/services/settings.service';
import { VocabularyEngine } from '../../../core/engines/vocabulary.engine';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { Synonym } from '../../../core/models/synonym.model';
import { Antonym } from '../../../core/models/antonym.model';
import { OneWord } from '../../../core/models/one-word.model';
import { Idiom } from '../../../core/models/idiom.model';
import { ReviewService } from '../../../core/services/review.service';
import { BookmarkService } from '../../../core/services/bookmark.service';

import * as lemmatizer from 'wink-lemmatizer';
import { ExampleFormatterService } from '../../../utils/example-formatter.service';
import { IdService } from '../../../utils/id.service';

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
  public formatterService = inject(ExampleFormatterService);
  private idService = inject(IdService);

  private refreshBookmarks = signal(0);

  public PracticeMode = PracticeMode;

  referenceTab = input<'all' | 'weak' | 'bookmark'>();

  readonly filteredSynonyms = computed(() => {
    const search = this.searchText()!.trim().toLowerCase();

    // const words = [...this.synonyms].sort((a, b) =>
    //   a.word.localeCompare(b.word),
    // );
    const words = [...this.synonyms()];

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
    const words = [...this.antonyms()];

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
    const words = [...this.oneWords()];

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
    const words = [...this.idioms()];

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

  readonly synonyms = computed(() => {
    this.refreshBookmarks();
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarkedQuestions<Synonym>();

      case 'weak':
        return this.reviewService.getPendingQuestions<Synonym>(this.mode);

      default:
        return this.vocabularyEngine.getSynonymsReference();
    }
  });

  readonly antonyms = computed(() => {
    this.refreshBookmarks();
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarkedQuestions<Antonym>();

      case 'weak':
        return this.reviewService.getPendingQuestions<Antonym>(this.mode);

      default:
        return this.vocabularyEngine.getAntonymsReference();
    }
  });

  readonly oneWords = computed(() => {
    this.refreshBookmarks();
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarkedQuestions<OneWord>();

      case 'weak':
        return this.reviewService.getPendingQuestions<OneWord>(this.mode);

      default:
        return this.vocabularyEngine.getOneWordsReference();
    }
  });

  readonly idioms = computed(() => {
    this.refreshBookmarks();
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarkedQuestions<Idiom>();

      case 'weak':
        return this.reviewService.getPendingQuestions<Idiom>(this.mode);

      default:
        return this.vocabularyEngine.getIdiomsReference();
    }
  });

  async toggleBookmark(
    question: Synonym | Antonym | OneWord | Idiom,
  ): Promise<void> {
    const entry = {
      id: this.getQuestionId(question),
      mode: this.mode,
      question,
    };

    await this.bookmarkService.toggle(entry);
    this.refreshBookmarks.update((v) => v + 1);
  }

  private getQuestionId(question: Synonym | Antonym | OneWord | Idiom): string {
    switch (this.mode) {
      case PracticeMode.Synonyms:
        return this.idService.getQuestionId((question as Synonym).word);

      case PracticeMode.Antonyms:
        return this.idService.getQuestionId((question as Antonym).word);

      case PracticeMode.OneWord:
        return this.idService.getQuestionId((question as OneWord).phrase);

      case PracticeMode.Idioms:
        return this.idService.getQuestionId((question as Idiom).idiom);

      default:
        return '';
    }
  }

  isBookmarked(question: Synonym | Antonym | OneWord | Idiom): boolean {
    return this.bookmarkService.isBookmarked(this.getQuestionId(question));
  }
}
