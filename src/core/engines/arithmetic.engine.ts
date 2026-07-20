import { Injectable } from '@angular/core';

import { SettingsService } from '../services/settings.service';

import { Question } from '../models/question.model';
import { ArithmeticQuestion } from '../models/arithmetic-question.model';
import { RandomService } from '../../utils/random.service';

@Injectable({
  providedIn: 'root',
})
export class ArithmeticEngine {
  constructor(
    private settingsService: SettingsService,
    private randomService: RandomService,
  ) {}

  generateAddition(): Question<ArithmeticQuestion> {
    const operands = this.randomizeOperandOrder(this.generateRandomOperands());

    return {
      question: `${operands.firstNumber} + ${operands.secondNumber}`,
      answer: String(operands.firstNumber + operands.secondNumber),
      data: operands,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  generateSubtraction(): Question<ArithmeticQuestion> {
    const operands = this.ensureFirstIsGreater(this.generateRandomOperands());

    return {
      question: `${operands.firstNumber} - ${operands.secondNumber}`,
      answer: String(operands.firstNumber - operands.secondNumber),
      data: operands,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  generateMultiplication(): Question<ArithmeticQuestion> {
    const operands = this.randomizeOperandOrder(this.generateRandomOperands());

    return {
      question: `${operands.firstNumber} × ${operands.secondNumber}`,
      answer: String(operands.firstNumber * operands.secondNumber),
      data: operands,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  generateDivision(): Question<ArithmeticQuestion> {
    const { firstDigits, secondDigits } = this.parseDigitSelection();

    const dividendDigits = firstDigits;
    const divisorDigits = secondDigits;

    let dividend = 0;
    let divisor = 0;
    let quotient = 0;

    do {
      divisor = this.randomService.randomWithDigits(divisorDigits);
      quotient = this.randomService.random(2, 99);

      dividend = divisor * quotient;
    } while (this.digitCount(dividend) !== dividendDigits);

    return {
      question: `${dividend} ÷ ${divisor}`,
      answer: String(quotient),
      data: {
        firstNumber: dividend,
        secondNumber: divisor,
      },
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  private generateRandomOperands(): ArithmeticQuestion {
    const { firstDigits, secondDigits } = this.parseDigitSelection();

    return {
      firstNumber: this.randomService.randomWithDigits(firstDigits),
      secondNumber: this.randomService.randomWithDigits(secondDigits),
    };
  }

  private parseDigitSelection() {
    const [firstDigits, secondDigits] = this.settingsService
      .settings()
      .digitSelection.split('x')
      .map(Number);

    return {
      firstDigits,
      secondDigits,
    };
  }

  private randomizeOperandOrder(
    operands: ArithmeticQuestion,
  ): ArithmeticQuestion {
    if (this.randomService.random(0, 1) === 0) {
      return operands;
    }

    return {
      firstNumber: operands.secondNumber,
      secondNumber: operands.firstNumber,
    };
  }

  private ensureFirstIsGreater(
    operands: ArithmeticQuestion,
  ): ArithmeticQuestion {
    if (operands.firstNumber >= operands.secondNumber) {
      return operands;
    }

    return {
      firstNumber: operands.secondNumber,
      secondNumber: operands.firstNumber,
    };
  }

  private digitCount(number: number): number {
    return number.toString().length;
  }
}
