import { inject, Injectable } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { PowerQuestion } from '../models/power-question.model';
import { Question } from '../models/question.model';
import { RandomService } from '../../utils/random.service';
import { ReviewService } from '../services/review.service';
import { PracticeMode } from '../enums/practice-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class PowerEngine {
  private randomService = inject(RandomService);

  private numbers: number[] = [];

  constructor(
    private settingsService: SettingsService,
    private reviewService: ReviewService,
  ) {}

  generateSquare(): Question<PowerQuestion> {
    const number = this.nextNumber();

    return {
      question: `${number}²`,
      answer: String(number * number),
      data: {
        number,
      },
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  generateCube(): Question<PowerQuestion> {
    const number = this.nextNumber();

    return {
      question: `${number}³`,
      answer: String(number ** 3),
      data: {
        number,
      },
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  generateSquareRoot(): Question<PowerQuestion> {
    const number = this.nextNumber();

    return {
      question: `√${number * number}`,
      answer: String(number),
      data: {
        number,
      },
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  generateCubeRoot(): Question<PowerQuestion> {
    const number = this.nextNumber();

    return {
      question: `∛${number ** 3}`,
      answer: String(number),
      data: {
        number,
      },
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  private nextNumber(): number {
    let review = this.reviewService.getNextReviewQuestion<number>();

    if (review !== null) {
      return review;
    }

    if (this.numbers.length === 0) {
      review = this.reviewService.getNextReviewQuestion<number>();

      if (review !== null) {
        return review;
      }

      this.resetNumbers();
    }

    return this.numbers.shift()!;
  }

  private resetNumbers(): void {
    const max = Number(this.settingsService.settings().numberRange);

    const numbers: number[] = [];

    for (let i = 2; i <= max; i++) {
      numbers.push(i);
    }

    this.numbers = this.randomService.shuffle(numbers);
  }

  getNumbersReference(): number[] {
    const max = Number(this.settingsService.settings().numberRange);

    return Array.from({ length: max - 1 }, (_, i) => i + 2);
  }
}
