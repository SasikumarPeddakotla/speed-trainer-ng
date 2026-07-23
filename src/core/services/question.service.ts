import { Injectable, signal } from '@angular/core';

import { AlphabetEngine } from '../engines/alphabet.engine';

import { Question } from '../models/question.model';

import { SettingsService } from './settings.service';

import { PracticeMode } from '../enums/practice-mode.enum';
import { Alphabet } from '../models/alphabet.model';
import { TablesEngine } from '../engines/tables.engine';
import { ArithmeticEngine } from '../engines/arithmetic.engine';
import { PowerEngine } from '../engines/power.engine';
import { ConversionEngine } from '../engines/conversion.engine';
import { PolityEngine } from '../engines/polity.engine';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly _currentQuestion = signal<Question | null>(null);

  readonly currentQuestion = this._currentQuestion.asReadonly();

  constructor(
    private settingsService: SettingsService,
    private alphabetEngine: AlphabetEngine,
    private arithmeticEngine: ArithmeticEngine,
    private tablesEngine: TablesEngine,
    private powerEngine: PowerEngine,
    private conversionEngine: ConversionEngine,
    private polityEngine: PolityEngine,
  ) {}

  nextQuestion() {
    switch (this.settingsService.settings().selectedExercise?.mode) {
      case PracticeMode.LetterToPosition:
        this._currentQuestion.set(this.alphabetEngine.letterToPosition());
        break;

      case PracticeMode.PositionToLetter:
        this._currentQuestion.set(this.alphabetEngine.positionToLetter());
        break;

      case PracticeMode.LetterToReversePosition:
        this._currentQuestion.set(
          this.alphabetEngine.letterToReversePosition(),
        );
        break;

      case PracticeMode.ReversePositionToLetter:
        this._currentQuestion.set(
          this.alphabetEngine.reversePositionToLetter(),
        );
        break;

      case PracticeMode.MirrorLetter:
        this._currentQuestion.set(this.alphabetEngine.mirrorLetter());
        break;

      case PracticeMode.Addition:
        this._currentQuestion.set(this.arithmeticEngine.generateAddition());
        break;

      case PracticeMode.Subtraction:
        this._currentQuestion.set(this.arithmeticEngine.generateSubtraction());
        break;

      case PracticeMode.Multiplication:
        this._currentQuestion.set(
          this.arithmeticEngine.generateMultiplication(),
        );
        break;

      case PracticeMode.Division:
        this._currentQuestion.set(this.arithmeticEngine.generateDivision());
        break;

      case PracticeMode.Tables:
        this._currentQuestion.set(this.tablesEngine.generate());
        break;

      case PracticeMode.Squares:
        this._currentQuestion.set(this.powerEngine.generateSquare());
        break;

      case PracticeMode.Cubes:
        this._currentQuestion.set(this.powerEngine.generateCube());
        break;

      case PracticeMode.SquareRoots:
        this._currentQuestion.set(this.powerEngine.generateSquareRoot());
        break;

      case PracticeMode.CubeRoots:
        this._currentQuestion.set(this.powerEngine.generateCubeRoot());
        break;

      case PracticeMode.FractionDecimal:
      case PracticeMode.FractionPercentage:
      case PracticeMode.DecimalPercentage:
        this._currentQuestion.set(this.conversionEngine.generateQuestion());
        break;

      case PracticeMode.Articles:
        this._currentQuestion.set(this.polityEngine.generateArticles());
    }
  }
}
