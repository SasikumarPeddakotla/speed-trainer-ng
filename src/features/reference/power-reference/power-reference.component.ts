import { Component, computed, inject, input, signal } from '@angular/core';
import { PowerEngine } from '../../../core/engines/power.engine';
import { SettingsService } from '../../../core/services/settings.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { PowerQuestion } from '../../../core/models/power-question.model';
import { ReviewService } from '../../../core/services/review.service';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { IdService } from '../../../utils/id.service';

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
  private idService = inject(IdService);

  private refreshBookmarks = signal(0);

  referenceTab = input<'all' | 'weak' | 'bookmark'>();

  public PracticeMode = PracticeMode;

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  readonly questions = computed(() => {
    this.refreshBookmarks();
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarkedQuestions<PowerQuestion>();

      case 'weak':
        return this.reviewService.getPendingQuestions<PowerQuestion>(this.mode);

      default:
        return this.powerEngine.getNumbersReference();
    }
  });

  async toggleBookmark(question: PowerQuestion): Promise<void> {
    const entry = {
      id: this.getQuestionId(question),
      mode: this.mode,
      question,
    };

    await this.bookmarkService.toggle(entry);
    this.refreshBookmarks.update((v) => v + 1);
  }

  private getQuestionId(question: PowerQuestion): string {
    switch (this.mode) {
      case PracticeMode.Squares:
        return this.idService.getQuestionId(question.number);

      case PracticeMode.Cubes:
        return this.idService.getQuestionId(question.number);

      case PracticeMode.SquareRoots:
        return this.idService.getQuestionId(question.number * question.number);

      case PracticeMode.CubeRoots:
        return this.idService.getQuestionId(question.number ** 3);

      default:
        return '';
    }
  }

  isBookmarked(question: PowerQuestion): boolean {
    return this.bookmarkService.isBookmarked(this.getQuestionId(question));
  }
}
