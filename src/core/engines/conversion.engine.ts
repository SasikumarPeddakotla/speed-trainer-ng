import { inject, Injectable } from '@angular/core';
import { FRACTION_CONVERSIONS } from '../data/fraction-conversions';
import { FractionConversion } from '../models/fraction-conversion.model';
import { SettingsService } from '../services/settings.service';
import { RandomService } from '../../utils/random.service';
import { Direction } from '../enums/direction.enum';
import { ConversionQuestion } from '../models/conversion-question.model';
import { Question } from '../models/question.model';
import { PracticeMode } from '../enums/practice-mode.enum';
import { ReviewService } from '../services/review.service';

@Injectable({
  providedIn: 'root',
})
export class ConversionEngine {
  private randomService = inject(RandomService);
  private conversions = this.randomService.shuffle([...FRACTION_CONVERSIONS]);

  constructor(
    private settingsService: SettingsService,
    private reviewService: ReviewService,
  ) {}

  generateQuestion() {
    const mode = this.settingsService.settings().selectedExercise?.mode;
    const direction = this.settingsService.settings().direction;
    const conversion = this.nextConversion();

    switch (mode) {
      case PracticeMode.FractionDecimal:
        return direction === Direction.Forward
          ? this.createConversionQuestion(conversion, 'fraction', 'decimal')
          : this.createConversionQuestion(conversion, 'decimal', 'fraction');

      case PracticeMode.FractionPercentage:
        return direction === Direction.Forward
          ? this.createConversionQuestion(conversion, 'fraction', 'percentage')
          : this.createConversionQuestion(conversion, 'percentage', 'fraction');

      case PracticeMode.DecimalPercentage:
        return direction === Direction.Forward
          ? this.createConversionQuestion(conversion, 'decimal', 'percentage')
          : this.createConversionQuestion(conversion, 'percentage', 'decimal');

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

      this.conversions = this.randomService.shuffle([...FRACTION_CONVERSIONS]);
    }

    return this.conversions.shift()!;
  }

  getConversionsReference(): FractionConversion[] {
    return FRACTION_CONVERSIONS;
  }
}
