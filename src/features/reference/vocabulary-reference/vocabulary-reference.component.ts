import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { StateService } from '../../../core/services/state.service';
import { VocabularyEngine } from '../../../core/engines/vocabulary.engine';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { Synonym } from '../../../core/models/synonym.model';
import { Antonym } from '../../../core/models/antonym.model';
import { OneWord } from '../../../core/models/one-word.model';
import { Idiom } from '../../../core/models/idiom.model';
import { BookmarkService } from '../../../core/services/bookmark.service';

import { ExampleFormatterService } from '../../../utils/example-formatter.service';
import { IdService } from '../../../utils/id.service';
import { DataPreloadService } from '../../../core/services/data-preload.service';
import { PhrasalVerb } from '../../../core/models/phrasal-verb.model';

@Component({
  selector: 'app-vocabulary-reference',
  standalone: true,
  imports: [],
  templateUrl: './vocabulary-reference.component.html',
  styleUrl: './vocabulary-reference.component.scss',
})
export class VocabularyReferenceComponent {
  searchText = input<string>();

  private stateService = inject(StateService);
  private vocabularyEngine = inject(VocabularyEngine);
  private bookmarkService = inject(BookmarkService);
  public formatterService = inject(ExampleFormatterService);
  private idService = inject(IdService);

  constructor(private dataPreloadService: DataPreloadService) {}

  async ngOnInit(): Promise<void> {
    await this.dataPreloadService.preloadForMode(
      this.stateService.navigation().selectedExercise?.mode,
    );
  }

  public PracticeMode = PracticeMode;

  referenceTab = input<'all' | 'bookmark'>();
  count = output<{
    allCount: number;
    bookmarkCount: number;
  }>();

  readonly allCount = computed(() => {
    switch (this.mode) {
      case PracticeMode.Synonyms:
        return this.vocabularyEngine.getSynonymsReference().length;

      case PracticeMode.Antonyms:
        return this.vocabularyEngine.getAntonymsReference().length;

      case PracticeMode.OneWord:
        return this.vocabularyEngine.getOneWordsReference().length;

      case PracticeMode.Idioms:
        return this.vocabularyEngine.getIdiomsReference().length;

      case PracticeMode.PhrasalVerbs:
        return this.vocabularyEngine.getPhrasalVerbsReference().length;

      default:
        return 0;
    }
  });

  readonly bookmarkCount = computed(() => {
    return this.bookmarkService.getBookmarkedQuestions().length;
  });

  private readonly emitCountsEffect = effect(() => {
    this.count.emit({
      allCount: this.allCount(),
      bookmarkCount: this.bookmarkCount(),
    });
  });

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

  readonly filteredPhrasalVerbs = computed(() => {
    const search = this.searchText()!.trim().toLowerCase();

    // const words = [...this.synonyms].sort((a, b) =>
    //   a.word.localeCompare(b.word),
    // );
    const words = [...this.phrasalVerbs()];

    if (!search) {
      return words;
    }

    return words.filter(
      (word) =>
        word.phrase.toLowerCase().includes(search) ||
        word.meaning.some((s) => s.toLowerCase().includes(search)) ||
        word.example.some((s) => s.toLowerCase().includes(search)),
    );
  });

  protected readonly mode = this.stateService.navigation().selectedExercise
    ?.mode as PracticeMode;

  readonly synonyms = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarkedQuestions<Synonym>();

      default:
        return this.vocabularyEngine.getSynonymsReference();
    }
  });

  readonly antonyms = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarkedQuestions<Antonym>();

      default:
        return this.vocabularyEngine.getAntonymsReference();
    }
  });

  readonly oneWords = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarkedQuestions<OneWord>();

      default:
        return this.vocabularyEngine.getOneWordsReference();
    }
  });

  readonly idioms = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarkedQuestions<Idiom>();

      default:
        return this.vocabularyEngine.getIdiomsReference();
    }
  });

  readonly phrasalVerbs = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarkedQuestions<PhrasalVerb>();

      default:
        return this.vocabularyEngine.getPhrasalVerbsReference();
    }
  });

  async toggleBookmark(
    question: Synonym | Antonym | OneWord | Idiom | PhrasalVerb,
  ): Promise<void> {
    const entry = {
      id: this.getQuestionId(question),
      mode: this.mode,
      question,
    };

    await this.bookmarkService.toggle(entry);
  }

  private getQuestionId(
    question: Synonym | Antonym | OneWord | Idiom | PhrasalVerb,
  ): string {
    switch (this.mode) {
      case PracticeMode.Synonyms:
        return this.idService.getQuestionId((question as Synonym).word);

      case PracticeMode.Antonyms:
        return this.idService.getQuestionId((question as Antonym).word);

      case PracticeMode.OneWord:
        return this.idService.getQuestionId((question as OneWord).phrase);

      case PracticeMode.Idioms:
        return this.idService.getQuestionId((question as Idiom).idiom);

      case PracticeMode.PhrasalVerbs:
        return this.idService.getQuestionId((question as PhrasalVerb).phrase);

      default:
        return '';
    }
  }

  isBookmarked(
    question: Synonym | Antonym | OneWord | Idiom | PhrasalVerb,
  ): boolean {
    return this.bookmarkService.isBookmarked(this.getQuestionId(question));
  }
}
