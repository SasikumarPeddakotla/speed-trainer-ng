import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { AlphabetEngine } from '../../../core/engines/alphabet.engine';
import { Alphabet } from '../../../core/models/alphabet.model';
import { ReviewService } from '../../../core/services/review.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { StateService } from '../../../core/services/state.service';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { IdService } from '../../../utils/id.service';

@Component({
  selector: 'app-alphabet-reference',
  standalone: true,
  imports: [],
  templateUrl: './alphabet-reference.component.html',
  styleUrl: './alphabet-reference.component.scss',
})
export class AlphabetReferenceComponent {
  referenceTab = input<'all' | 'weak' | 'bookmark'>();
  count = output<{
    allCount: number;
    weakCount: number;
    bookmarkCount: number;
  }>();

  private alphabetEngine = inject(AlphabetEngine);
  private reviewService = inject(ReviewService);
  private stateService = inject(StateService);
  private bookmarkService = inject(BookmarkService);
  private idService = inject(IdService);

  protected readonly mode = this.stateService.navigation().selectedExercise
    ?.mode as PracticeMode;

  private refreshBookmarks = signal(0);

  private readonly allQuestions = this.alphabetEngine.getAlphabetReference();
  private readonly weakQuestions = computed(() =>
    this.reviewService.getPendingQuestions<Alphabet>(this.mode),
  );

  private readonly bookmarkQuestions = computed(() => {
    this.refreshBookmarks();
    return this.bookmarkService.getBookmarkedQuestions<Alphabet>();
  });

  private readonly emitCountsEffect = effect(() => {
    this.count.emit({
      allCount: this.allQuestions.length,
      weakCount: this.weakQuestions().length,
      bookmarkCount: this.bookmarkQuestions().length,
    });
  });

  readonly alphabets = computed(() => {
    this.refreshBookmarks();
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkQuestions();

      case 'weak':
        return this.weakQuestions();

      default:
        return this.allQuestions;
    }
  });

  protected readonly showMnemonics = signal(false);

  toggleReferenceView(): void {
    this.showMnemonics.update((value) => !value);
  }

  async toggleBookmark(alphabet: Alphabet): Promise<void> {
    const entry = {
      id: this.getQuestionId(alphabet),
      mode: this.mode,
      question: alphabet,
    };

    await this.bookmarkService.toggle(entry);
    this.refreshBookmarks.update((v) => v + 1);
  }

  isBookmarked(alphabet: Alphabet): boolean {
    return this.bookmarkService.isBookmarked(this.getQuestionId(alphabet));
  }

  private getQuestionId(alphabet: Alphabet): string {
    switch (this.mode) {
      case PracticeMode.LetterToPosition:
        return this.idService.getQuestionId(alphabet.letter);
      case PracticeMode.PositionToLetter:
        return this.idService.getQuestionId(alphabet.position);

      case PracticeMode.LetterToReversePosition:
        return this.idService.getQuestionId(alphabet.letter);
      case PracticeMode.ReversePositionToLetter:
        return this.idService.getQuestionId(alphabet.reversePosition);

      case PracticeMode.MirrorLetter:
        return this.idService.getQuestionId(alphabet.letter);

      default:
        return '';
    }
  }
}
