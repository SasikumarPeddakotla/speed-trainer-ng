import { Component, computed, inject, input } from '@angular/core';

import { AlphabetEngine } from '../../../core/engines/alphabet.engine';
import { Alphabet } from '../../../core/models/alphabet.model';
import { ReviewService } from '../../../core/services/review.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { SettingsService } from '../../../core/services/settings.service';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { Direction } from '../../../core/enums/direction.enum';

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

  private removedBookmarks = new Set<Alphabet>();

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  readonly alphabets = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return [...this.bookmarkService.getBookmarks<Alphabet>(this.mode)];

      case 'weak':
        return this.reviewService.getPendingQuestions<Alphabet>(this.mode);

      default:
        return this.alphabetEngine.getAlphabetReference();
    }
  });

  toggleBookmark(alphabet: Alphabet): void {
    const entry = {
      id: this.getQuestionId(alphabet),
      mode: this.mode,
      question: alphabet,
    };

    if (this.removedBookmarks.has(alphabet)) {
      this.bookmarkService.add(entry);
      this.removedBookmarks.delete(alphabet);
    } else {
      this.bookmarkService.remove(entry);
      this.removedBookmarks.add(alphabet);
    }
  }

  private getQuestionId(alphabet: Alphabet): string {
    const direction = this.settingsService.settings().direction;

    switch (this.mode) {
      case PracticeMode.LetterPosition:
        return direction === Direction.Forward
          ? `lp:f:${alphabet.letter}`
          : `lp:r:${alphabet.letter}`;

      case PracticeMode.LetterReversePosition:
        return direction === Direction.Forward
          ? `lrp:f:${alphabet.letter}`
          : `lrp:r:${alphabet.letter}`;

      case PracticeMode.MirrorLetter:
        return `mirror:${alphabet.letter}`;

      default:
        return '';
    }
  }

  isRemoved(alphabet: Alphabet): boolean {
    return this.removedBookmarks.has(alphabet);
  }
}
