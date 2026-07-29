import { Component, computed, inject, input } from '@angular/core';
import { PowerEngine } from '../../../core/engines/power.engine';
import { SettingsService } from '../../../core/services/settings.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { PowerQuestion } from '../../../core/models/power-question.model';
import { ReviewService } from '../../../core/services/review.service';
import { BookmarkService } from '../../../core/services/bookmark.service';

@Component({
  selector: 'app-power-reference',
  imports: [],
  templateUrl: './power-reference.component.html',
  styleUrl: './power-reference.component.scss',
})
export class PowerReferenceComponent {
  private settingsService = inject(SettingsService);
  private powerEngine = inject(PowerEngine);
  private reviewService = inject(ReviewService);
  private bookmarkService = inject(BookmarkService);

  private removedBookmarks = new Set<unknown>();

  referenceTab = input<'all' | 'weak' | 'bookmark'>();

  public PracticeMode = PracticeMode;

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  readonly questions = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return [...this.bookmarkService.getBookmarks<PowerQuestion>(this.mode)];

      case 'weak':
        return this.reviewService.getPendingQuestions<PowerQuestion>(this.mode);

      default:
        return this.powerEngine.getNumbersReference();
    }
  });

  toggleBookmark<T>(question: T): void {
    if (this.removedBookmarks.has(question)) {
      this.bookmarkService.add(this.mode, question);
      this.removedBookmarks.delete(question);
    } else {
      this.bookmarkService.remove(this.mode, question);
      this.removedBookmarks.add(question);
    }
  }

  isRemoved(question: unknown): boolean {
    return this.removedBookmarks.has(question);
  }
}
