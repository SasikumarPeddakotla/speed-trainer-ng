import { Injectable } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { PowerQuestion } from '../models/power-question.model';
import { Question } from '../models/question.model';
import { RandomService } from '../../utils/random.service';

@Injectable({
  providedIn: 'root',
})
export class PowerEngine {
  constructor(
    private settingsService: SettingsService,
    private randomService: RandomService,
  ) {}

  generateSquare(): Question<PowerQuestion> {
    const number = this.generateNumber();

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
    const number = this.generateNumber();

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
    const number = this.generateNumber();

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
    const number = this.generateNumber();

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

  private generateNumber(): number {
    const max = Number(this.settingsService.settings().numberRange);

    return this.randomService.random(2, max);
  }
}
