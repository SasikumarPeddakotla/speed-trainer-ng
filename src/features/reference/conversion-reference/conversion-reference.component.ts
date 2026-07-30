import { Component, computed, inject, input } from '@angular/core';

import { ConversionEngine } from '../../../core/engines/conversion.engine';
import { FractionConversion } from '../../../core/models/fraction-conversion.model';
import { SettingsService } from '../../../core/services/settings.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { ReviewService } from '../../../core/services/review.service';
import { ConversionQuestion } from '../../../core/models/conversion-question.model';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { Direction } from '../../../core/enums/direction.enum';

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

  private removedBookmarks = new Set<ConversionQuestion>();

  referenceTab = input<'all' | 'weak' | 'bookmark'>();

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  readonly conversions = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return [
          ...this.bookmarkService.getBookmarks<ConversionQuestion>(this.mode),
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

  toggleBookmark(question: ConversionQuestion): void {
    const entry = {
      id: this.getQuestionId(question),
      mode: this.mode,
      question,
    };

    if (this.removedBookmarks.has(question)) {
      this.bookmarkService.add(entry);
      this.removedBookmarks.delete(question);
    } else {
      this.bookmarkService.remove(entry);
      this.removedBookmarks.add(question);
    }
  }

  private getQuestionId(question: ConversionQuestion): string {
    const direction = this.settingsService.settings().direction;
    const fraction = question.conversion.fraction;

    switch (this.mode) {
      case PracticeMode.FractionDecimal:
        return direction === Direction.Forward
          ? `fraction-decimal:${fraction}`
          : `decimal-fraction:${fraction}`;

      case PracticeMode.FractionPercentage:
        return direction === Direction.Forward
          ? `fraction-percentage:${fraction}`
          : `percentage-fraction:${fraction}`;

      case PracticeMode.DecimalPercentage:
        return direction === Direction.Forward
          ? `decimal-percentage:${fraction}`
          : `percentage-decimal:${fraction}`;

      default:
        return '';
    }
  }

  isRemoved(question: ConversionQuestion): boolean {
    return this.removedBookmarks.has(question);
  }
}
