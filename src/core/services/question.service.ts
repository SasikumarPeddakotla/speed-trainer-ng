import { Injectable, signal } from '@angular/core';

import { AlphabetEngine } from '../engines/alphabet.engine';

import { Question } from '../models/question.model';

import { SettingsService } from './settings.service';

import { PracticeMode } from '../enums/practice-mode.enum';
import { TablesEngine } from '../engines/tables.engine';
import { ArithmeticEngine } from '../engines/arithmetic.engine';
import { PowerEngine } from '../engines/power.engine';
import { ConversionEngine } from '../engines/conversion.engine';
import { PolityEngine } from '../engines/polity.engine';
import { VocabularyEngine } from '../engines/vocabulary.engine';
import { BookmarkEngine } from '../engines/bookmark.engine';

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
    private vocabularyEngine: VocabularyEngine,
    private bookmarkEngine: BookmarkEngine,
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

      case PracticeMode.FractionToDecimal:
      case PracticeMode.DecimalToFraction:
      case PracticeMode.FractionToPercentage:
      case PracticeMode.PercentageToFraction:
      case PracticeMode.DecimalToPercentage:
      case PracticeMode.PercentageToDecimal:
        this._currentQuestion.set(this.conversionEngine.generateQuestion());
        break;

      case PracticeMode.ArticleToTitle:
        this._currentQuestion.set(this.polityEngine.generateArticleToTitle());
        break;
      case PracticeMode.TitleToArticle:
        this._currentQuestion.set(this.polityEngine.generateTitleToArticle());
        break;

      case PracticeMode.Synonyms:
        this._currentQuestion.set(
          this.vocabularyEngine.generateSynonymQuestion(),
        );
        break;

      case PracticeMode.Antonyms:
        this._currentQuestion.set(
          this.vocabularyEngine.generateAntonymQuestion(),
        );
        break;

      case PracticeMode.OneWord:
        this._currentQuestion.set(
          this.vocabularyEngine.generateOneWordQuestion(),
        );
        break;

      case PracticeMode.Idioms:
        this._currentQuestion.set(
          this.vocabularyEngine.generateIdiomQuestion(),
        );
        break;

      case PracticeMode.Bookmark:
        this._currentQuestion.set(this.bookmarkEngine.generateQuestion());
        break;
    }
  }

  resetAllEngines() {
    this.alphabetEngine.reset();
    this.tablesEngine.reset();
    this.powerEngine.reset();
    this.conversionEngine.reset();
    this.polityEngine.reset();
    this.vocabularyEngine.reset();
    this.bookmarkEngine.reset();
  }
}
