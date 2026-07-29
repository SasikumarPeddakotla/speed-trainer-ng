import { Component, computed, inject, input } from '@angular/core';

import { AlphabetEngine } from '../../../core/engines/alphabet.engine';
import { Alphabet } from '../../../core/models/alphabet.model';
import { ReviewService } from '../../../core/services/review.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { SettingsService } from '../../../core/services/settings.service';
import { BookmarkService } from '../../../core/services/bookmark.service';

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
    if (this.removedBookmarks.has(alphabet)) {
      this.bookmarkService.add(this.mode, alphabet);
      this.removedBookmarks.delete(alphabet);
    } else {
      this.bookmarkService.remove(this.mode, alphabet);
      this.removedBookmarks.add(alphabet);
    }
  }

  isRemoved(alphabet: Alphabet): boolean {
    return this.removedBookmarks.has(alphabet);
  }
}
