import { inject, Injectable } from '@angular/core';
import { StateService } from '../services/state.service';
import { Question } from '../models/question.model';
import { RandomService } from '../../utils/random.service';
import { ReviewService } from '../services/review.service';
import { IdService } from '../../utils/id.service';

@Injectable({
  providedIn: 'root',
})
export class PowerEngine {
  private randomService = inject(RandomService);

  private numbers: number[] = [];

  constructor(
    private stateService: StateService,
    private reviewService: ReviewService,
    private idService: IdService,
  ) {}

  generateSquare(): Question<number> {
    const number = this.nextNumber();

    return this.createSquare(number);
  }

  generateCube(): Question<number> {
    const number = this.nextNumber();

    return this.createCube(number);
  }

  generateSquareRoot(): Question<number> {
    const number = this.nextNumber();

    return this.createSquareRoot(number);
  }

  generateCubeRoot(): Question<number> {
    const number = this.nextNumber();

    return this.createCubeRoot(number);
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
    const max = Number(this.stateService.practice().numberRange);

    const numbers: number[] = [];

    for (let i = 2; i <= max; i++) {
      numbers.push(i);
    }

    this.numbers = this.randomService.shuffle(numbers);
  }

  createSquare(number: number): Question<number> {
    return {
      id: this.idService.getQuestionId(number),
      question: `${number}²`,
      answer: String(number * number),
      data: number,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  createCube(number: number): Question<number> {
    return {
      id: this.idService.getQuestionId(number),
      question: `${number}³`,
      answer: String(number ** 3),
      data: number,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  createSquareRoot(number: number): Question<number> {
    return {
      id: this.idService.getQuestionId(number * number),
      question: `√${number * number}`,
      answer: String(number),
      data: number,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  createCubeRoot(number: number): Question<number> {
    return {
      id: this.idService.getQuestionId(number ** 3),
      question: `∛${number ** 3}`,
      answer: String(number),
      data: number,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  getNumbersReference(): number[] {
    const max = Number(this.stateService.practice().numberRange);

    return Array.from({ length: max - 1 }, (_, i) => i + 2);
  }

  reset() {
    this.numbers = [];
  }
}
