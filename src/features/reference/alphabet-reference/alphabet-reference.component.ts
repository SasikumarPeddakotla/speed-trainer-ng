import { Component, computed, inject, input, signal } from '@angular/core';

import { AlphabetEngine } from '../../../core/engines/alphabet.engine';
import { Alphabet } from '../../../core/models/alphabet.model';
import { ReviewService } from '../../../core/services/review.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { SettingsService } from '../../../core/services/settings.service';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { Direction } from '../../../core/enums/direction.enum';
import { IdService } from '../../../utils/id.service';
import { DialogService } from '../../../core/services/dialog.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

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
  private dialogService = inject(DialogService);
  private snackbarService = inject(SnackbarService);

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  private refreshBookmarks = signal(0);

  readonly alphabets = computed(() => {
    this.refreshBookmarks();
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarks<Alphabet>(this.mode);

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

  private getQuestionId(alphabet: Alphabet): string {
    const direction = this.settingsService.settings().direction;

    switch (this.mode) {
      case PracticeMode.LetterPosition:
        return direction === Direction.Forward
          ? this.idService.getQuestionId(alphabet.letter)
          : this.idService.getQuestionId(alphabet.position);

      case PracticeMode.LetterReversePosition:
        return direction === Direction.Forward
          ? this.idService.getQuestionId(alphabet.letter)
          : this.idService.getQuestionId(alphabet.reversePosition);

      case PracticeMode.MirrorLetter:
        return this.idService.getQuestionId(alphabet.letter);

      default:
        return '';
    }
  }
}
