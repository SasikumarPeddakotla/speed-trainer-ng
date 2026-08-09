import { Component, computed, inject, input, signal } from '@angular/core';

import { ConversionEngine } from '../../../core/engines/conversion.engine';
import { SettingsService } from '../../../core/services/settings.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { ReviewService } from '../../../core/services/review.service';
import { ConversionQuestion } from '../../../core/models/conversion-question.model';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { IdService } from '../../../utils/id.service';

@Component({
  selector: 'app-conversion-reference',
  imports: [],
  templateUrl: './conversion-reference.component.html',
  styleUrl: './conversion-reference.component.scss',
})
export class ConversionReferenceComponent {
  private conversionEngine = inject(ConversionEngine);
  private settingsService = inject(SettingsService);
  private reviewService = inject(ReviewService);
  private bookmarkService = inject(BookmarkService);
  private idService = inject(IdService);

  private refreshBookmarks = signal(0);

  referenceTab = input<'all' | 'weak' | 'bookmark'>();

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  readonly conversions = computed(() => {
    this.refreshBookmarks();
    switch (this.referenceTab()) {
      case 'bookmark':
        return [
          ...this.bookmarkService.getBookmarkedQuestions<ConversionQuestion>(),
        ];

      case 'weak':
        return this.reviewService.getPendingQuestions<ConversionQuestion>(
          this.mode,
        );

      default:
        return this.conversionEngine
          .getConversionsReference()
          .map((conversion) => ({ conversion }));
    }
  });

  async toggleBookmark(question: ConversionQuestion): Promise<void> {
    const entry = {
      id: this.getQuestionId(question),
      mode: this.mode,
      question,
    };

    await this.bookmarkService.toggle(entry);
    this.refreshBookmarks.update((v) => v + 1);
  }

  private getQuestionId(question: ConversionQuestion): string {
    switch (this.mode) {
      case PracticeMode.FractionToDecimal:
        return this.idService.getQuestionId(question.conversion.fraction);
      case PracticeMode.DecimalToFraction:
        return this.idService.getQuestionId(question.conversion.decimal);

      case PracticeMode.FractionToPercentage:
        return this.idService.getQuestionId(question.conversion.fraction);
      case PracticeMode.PercentageToFraction:
        return this.idService.getQuestionId(question.conversion.percentage);

      case PracticeMode.DecimalToPercentage:
        return this.idService.getQuestionId(question.conversion.decimal);
      case PracticeMode.PercentageToDecimal:
        return this.idService.getQuestionId(question.conversion.percentage);

      default:
        return '';
    }
  }

  isBookmarked(question: ConversionQuestion): boolean {
    return this.bookmarkService.isBookmarked(this.getQuestionId(question));
  }
}
