import { Component, computed, inject, input, signal } from '@angular/core';

import { AlphabetEngine } from '../../../core/engines/alphabet.engine';
import { Alphabet } from '../../../core/models/alphabet.model';
import { ReviewService } from '../../../core/services/review.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { SettingsService } from '../../../core/services/settings.service';
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

  private alphabetEngine = inject(AlphabetEngine);
  private reviewService = inject(ReviewService);
  private settingsService = inject(SettingsService);
  private bookmarkService = inject(BookmarkService);
  private idService = inject(IdService);

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  private refreshBookmarks = signal(0);

  readonly alphabets = computed(() => {
    this.refreshBookmarks();
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarkedQuestions<Alphabet>();

      case 'weak':
        return this.reviewService.getPendingQuestions<Alphabet>(this.mode);

      default:
        return this.alphabetEngine.getAlphabetReference();
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
