import { inject, Injectable } from '@angular/core';
import { FractionConversion } from '../models/fraction-conversion.model';
import { StateService } from '../services/state.service';
import { RandomService } from '../../utils/random.service';
import { Question } from '../models/question.model';
import { PracticeMode } from '../enums/practice-mode.enum';
import { IdService } from '../../utils/id.service';
import { BookmarkService } from '../services/bookmark.service';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root',
})
export class ConversionEngine {
  private randomService = inject(RandomService);
  private conversions: FractionConversion[] = [];

  constructor(
    private stateService: StateService,
    private idService: IdService,
    private bookmarkService: BookmarkService,
    private dataService: DataService,
  ) {}

  generateQuestion() {
    const mode = this.stateService.navigation().selectedExercise?.mode;
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
  ): Question<FractionConversion> {
    return {
      id: this.idService.getQuestionId(conversion[questionKey]),
      question:
        conversion[questionKey] + (questionKey === 'percentage' ? '%' : ''),
      answer: conversion[answerKey],
      data: conversion,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  private nextConversion(): FractionConversion {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalConversion();
      case 'bookmark':
        return this.nextBookmarkConversion();
    }
  }

  private nextNormalConversion(): FractionConversion {
    if (this.conversions.length === 0) {
      this.resetConversions();
    }
    return this.conversions.shift()!;
  }

  private nextBookmarkConversion(): FractionConversion {
    if (this.conversions.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<FractionConversion>();
      this.conversions = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.conversions.shift()!;
  }

  resetConversions(): void {
    const { denominatorSelection, selectedDenominators } =
      this.stateService.practice();

    const fractionConversions = this.dataService.getFractionConversions();

    if (denominatorSelection === 'all') {
      this.conversions = this.randomService.shuffle([...fractionConversions]);
    }

    const selected = new Set(selectedDenominators);

    const converisons = fractionConversions.filter((conversion) => {
      const denominator = `/${conversion.fraction.split('/')[1]}`;
      return selected.has(denominator);
    });

    this.conversions = this.randomService.shuffle([...converisons]);
  }

  getConversionsReference(): FractionConversion[] {
    return this.dataService.getFractionConversions();
  }

  reset() {
    this.conversions = [];
  }
}
