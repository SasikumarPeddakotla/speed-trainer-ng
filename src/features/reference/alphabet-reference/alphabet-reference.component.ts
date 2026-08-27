import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';

import { AlphabetEngine } from '../../../core/engines/alphabet.engine';
import { Alphabet } from '../../../core/models/alphabet.model';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { StateService } from '../../../core/services/state.service';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { IdService } from '../../../utils/id.service';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-alphabet-reference',
  standalone: true,
  imports: [],
  templateUrl: './alphabet-reference.component.html',
  styleUrl: './alphabet-reference.component.scss',
})
export class AlphabetReferenceComponent {
  readonly PracticeMode = PracticeMode;

  referenceTab = input<'all' | 'bookmark'>();
  count = output<{
    allCount: number;
    bookmarkCount: number;
  }>();

  private alphabetEngine = inject(AlphabetEngine);
  private stateService = inject(StateService);
  private bookmarkService = inject(BookmarkService);
  private idService = inject(IdService);

  protected readonly mode = this.stateService.navigation().selectedExercise
    ?.mode as PracticeMode;

  private readonly allQuestions = computed(() => {
    return this.alphabetEngine.getAlphabetReference();
  });
  private readonly bookmarkQuestions = computed(() => {
    return this.bookmarkService.getBookmarkedQuestions<Alphabet>();
  });

  // To return the counts to parent
  private readonly emitCountsEffect = effect(() => {
    this.count.emit({
      allCount: this.allQuestions().length,
      bookmarkCount: this.bookmarkQuestions().length,
    });
  });

  readonly alphabets = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkQuestions();

      default:
        return this.allQuestions();
    }
  });

  async toggleBookmark(alphabet: Alphabet): Promise<void> {
    const entry = {
      id: this.getQuestionId(alphabet),
      mode: this.mode,
      question: alphabet,
    };

    await this.bookmarkService.toggle(entry);
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
