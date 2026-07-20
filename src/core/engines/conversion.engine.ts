import { Injectable } from '@angular/core';
import { FRACTION_CONVERSIONS } from '../data/fraction-conversions';
import { FractionConversion } from '../models/fraction-conversion.model';
import { SettingsService } from '../services/settings.service';
import { RandomService } from '../../utils/random.service';
import { Direction } from '../enums/direction.enum';
import { ConversionQuestion } from '../models/conversion-question.model';
import { Question } from '../models/question.model';
import { PracticeMode } from '../enums/practice-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class ConversionEngine {
  constructor(
    private settingsService: SettingsService,
    private randomService: RandomService,
  ) {}

  private randomConversion(): FractionConversion {
    return FRACTION_CONVERSIONS[
      this.randomService.random(0, FRACTION_CONVERSIONS.length - 1)
    ];
  }

  generateQuestion() {
    const mode = this.settingsService.settings().selectedExercise?.mode;
    const direction = this.settingsService.settings().direction;
    switch (mode) {
      case PracticeMode.FractionDecimal:
        return direction === Direction.Forward
          ? this.generateConversionQuestion('fraction', 'decimal')
          : this.generateConversionQuestion('decimal', 'fraction');

      case PracticeMode.FractionPercentage:
        return direction === Direction.Forward
          ? this.generateConversionQuestion('fraction', 'percentage')
          : this.generateConversionQuestion('percentage', 'fraction');

      case PracticeMode.DecimalPercentage:
        return direction === Direction.Forward
          ? this.generateConversionQuestion('decimal', 'percentage')
          : this.generateConversionQuestion('percentage', 'decimal');

      default:
        return null;
    }
  }

  private generateConversionQuestion(
    questionKey: keyof FractionConversion,
    answerKey: keyof FractionConversion,
  ): Question<ConversionQuestion> {
    const conversion = this.randomConversion();

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
}
