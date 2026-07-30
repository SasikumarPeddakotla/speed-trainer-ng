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

    return this.createSquare({ number });
  }

  generateCube(): Question<PowerQuestion> {
    const number = this.nextNumber();

    return this.createCube({ number });
  }

  generateSquareRoot(): Question<PowerQuestion> {
    const number = this.nextNumber();

    return this.createSquareRoot({ number });
  }

  generateCubeRoot(): Question<PowerQuestion> {
    const number = this.nextNumber();

    return this.createCubeRoot({ number });
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

  createSquare(question: PowerQuestion): Question<PowerQuestion> {
    return {
      id: `square:${question.number}`,
      question: `${question.number}²`,
      answer: String(question.number * question.number),
      data: question,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  createCube(question: PowerQuestion): Question<PowerQuestion> {
    return {
      id: `cube:${question.number}`,
      question: `${question.number}³`,
      answer: String(question.number ** 3),
      data: question,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  createSquareRoot(question: PowerQuestion): Question<PowerQuestion> {
    return {
      id: `sqrt:${question.number}`,
      question: `√${question.number * question.number}`,
      answer: String(question.number),
      data: question,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  createCubeRoot(question: PowerQuestion): Question<PowerQuestion> {
    return {
      id: `cbrt:${question.number}`,
      question: `∛${question.number ** 3}`,
      answer: String(question.number),
      data: question,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  getNumbersReference(): PowerQuestion[] {
    const max = Number(this.settingsService.settings().numberRange);

    return Array.from({ length: max - 1 }, (_, i) => ({
      number: i + 2,
    }));
  }
}
