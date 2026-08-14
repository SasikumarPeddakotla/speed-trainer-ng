import { inject, Injectable } from '@angular/core';
import { FRACTION_CONVERSIONS } from '../data/fraction-conversions';
import { FractionConversion } from '../models/fraction-conversion.model';
import { SettingsService } from '../services/settings.service';
import { RandomService } from '../../utils/random.service';
import { ConversionQuestion } from '../models/conversion-question.model';
import { Question } from '../models/question.model';
import { PracticeMode } from '../enums/practice-mode.enum';
import { ReviewService } from '../services/review.service';
import { IdService } from '../../utils/id.service';

@Injectable({
  providedIn: 'root',
})
export class ConversionEngine {
  private randomService = inject(RandomService);
  private conversions = this.randomService.shuffle([...FRACTION_CONVERSIONS]);

  constructor(
    private settingsService: SettingsService,
    private reviewService: ReviewService,
    private idService: IdService,
  ) {}

  generateQuestion() {
    const mode = this.settingsService.settings().selectedExercise?.mode;
    const conversion = this.nextConversion();

    switch (mode) {
      case PracticeMode.FractionToDecimal:
        return this.createConversionQuestion(conversion, 'fraction', 'decimal');

      case PracticeMode.DecimalToFraction:
        return this.createConversionQuestion(conversion, 'decimal', 'fraction');

      case PracticeMode.FractionToPercentage:
        return this.createConversionQuestion(
          conversion,
          'fraction',
          'percentage',
        );
      case PracticeMode.PercentageToFraction:
        return this.createConversionQuestion(
          conversion,
          'percentage',
          'fraction',
        );

      case PracticeMode.DecimalToPercentage:
        return this.createConversionQuestion(
          conversion,
          'decimal',
          'percentage',
        );
      case PracticeMode.PercentageToDecimal:
        return this.createConversionQuestion(
          conversion,
          'percentage',
          'decimal',
        );

      default:
        return null;
    }
  }

  createConversionQuestion(
    conversion: FractionConversion,
    questionKey: keyof FractionConversion,
    answerKey: keyof FractionConversion,
  ): Question<ConversionQuestion> {
    return {
      id: this.idService.getQuestionId(conversion[questionKey]),
      question:
        conversion[questionKey] + (questionKey === 'percentage' ? '%' : ''),
      answer: conversion[answerKey],
      data: {
        conversion,
      },
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  private nextConversion(): FractionConversion {
    let review = this.reviewService.getNextReviewQuestion<FractionConversion>();

    if (review) {
      return review;
    }

    if (this.conversions.length === 0) {
      let review =
        this.reviewService.getNextReviewQuestion<FractionConversion>();

      if (review) {
        return review;
      }

      this.resetConversions();
    }

    return this.conversions.shift()!;
  }

  resetConversions(): void {
    const { denominatorSelection, selectedDenominators } =
      this.settingsService.settings();

    if (denominatorSelection === 'all') {
      this.conversions = this.randomService.shuffle([...FRACTION_CONVERSIONS]);
    }

    const selected = new Set(selectedDenominators);

    const converisons = FRACTION_CONVERSIONS.filter((conversion) => {
      const denominator = `/${conversion.fraction.split('/')[1]}`;
      return selected.has(denominator);
    });

    this.conversions = this.randomService.shuffle([...converisons]);
  }

  getConversionsReference(): FractionConversion[] {
    const { denominatorSelection, selectedDenominators } =
      this.settingsService.settings();

    if (denominatorSelection === 'all') {
      return FRACTION_CONVERSIONS;
    }

    const selected = new Set(selectedDenominators);

    return FRACTION_CONVERSIONS.filter((conversion) => {
      const denominator = `/${conversion.fraction.split('/')[1]}`;
      return selected.has(denominator);
    });
  }

  reset() {
    this.conversions = [];
  }
}
