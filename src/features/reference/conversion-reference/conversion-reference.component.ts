import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { ConversionEngine } from '../../../core/engines/conversion.engine';
import { StateService } from '../../../core/services/state.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
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
  private bookmarkService = inject(BookmarkService);
  private idService = inject(IdService);

  readonly PracticeMode = PracticeMode;

  referenceTab = input<'all' | 'bookmark'>();
  count = output<{
    allCount: number;
    bookmarkCount: number;
  }>();

  protected readonly mode = this.stateService.navigation().selectedExercise
    ?.mode as PracticeMode;

  private readonly allQuestions =
    this.conversionEngine.getConversionsReference();
  private readonly bookmarkQuestions = computed(() => {
    return this.bookmarkService.getBookmarkedQuestions<FractionConversion>();
  });

  // To return the counts to parent
  private readonly emitCountsEffect = effect(() => {
    this.count.emit({
      allCount: this.allQuestions.length,
      bookmarkCount: this.bookmarkQuestions().length,
    });
  });

  readonly conversions = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkQuestions();

      default:
        return this.allQuestions;
    }
  });

  async toggleBookmark(conversion: FractionConversion): Promise<void> {
    const entry = {
      id: this.getQuestionId(conversion),
      mode: this.mode,
      question: conversion,
    };

    await this.bookmarkService.toggle(entry);
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
