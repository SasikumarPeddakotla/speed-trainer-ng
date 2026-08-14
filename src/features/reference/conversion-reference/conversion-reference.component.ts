import { Component, computed, inject, input, signal } from '@angular/core';

import { ConversionEngine } from '../../../core/engines/conversion.engine';
import { StateService } from '../../../core/services/state.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { ReviewService } from '../../../core/services/review.service';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { IdService } from '../../../utils/id.service';
import { FractionConversion } from '../../../core/models/fraction-conversion.model';

@Component({
  selector: 'app-conversion-reference',
  imports: [],
  templateUrl: './conversion-reference.component.html',
  styleUrl: './conversion-reference.component.scss',
})
export class ConversionReferenceComponent {
  private conversionEngine = inject(ConversionEngine);
  private stateService = inject(StateService);
  private reviewService = inject(ReviewService);
  private bookmarkService = inject(BookmarkService);
  private idService = inject(IdService);

  private refreshBookmarks = signal(0);

  referenceTab = input<'all' | 'weak' | 'bookmark'>();

  protected readonly mode = this.stateService.navigation().selectedExercise
    ?.mode as PracticeMode;

  readonly conversions = computed(() => {
    this.refreshBookmarks();
    switch (this.referenceTab()) {
      case 'bookmark':
        return [
          ...this.bookmarkService.getBookmarkedQuestions<FractionConversion>(),
        ];

      case 'weak':
        return this.reviewService.getPendingQuestions<FractionConversion>(
          this.mode,
        );

      default:
        return this.conversionEngine.getConversionsReference();
      // .map((conversion) => ({ conversion }));
    }
  });

  async toggleBookmark(conversion: FractionConversion): Promise<void> {
    const entry = {
      id: this.getQuestionId(conversion),
      mode: this.mode,
      question: conversion,
    };

    await this.bookmarkService.toggle(entry);
    this.refreshBookmarks.update((v) => v + 1);
  }

  private getQuestionId(conversion: FractionConversion): string {
    switch (this.mode) {
      case PracticeMode.FractionToDecimal:
        return this.idService.getQuestionId(conversion.fraction);
      case PracticeMode.DecimalToFraction:
        return this.idService.getQuestionId(conversion.decimal);

      case PracticeMode.FractionToPercentage:
        return this.idService.getQuestionId(conversion.fraction);
      case PracticeMode.PercentageToFraction:
        return this.idService.getQuestionId(conversion.percentage);

      case PracticeMode.DecimalToPercentage:
        return this.idService.getQuestionId(conversion.decimal);
      case PracticeMode.PercentageToDecimal:
        return this.idService.getQuestionId(conversion.percentage);

      default:
        return '';
    }
  }

  isBookmarked(question: FractionConversion): boolean {
    return this.bookmarkService.isBookmarked(this.getQuestionId(question));
  }
}
