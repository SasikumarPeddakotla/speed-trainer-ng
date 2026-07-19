import { Injectable, signal } from '@angular/core';

import { AlphabetEngine } from '../engines/alphabet.engine';

import { Question } from '../models/question.model';

import { SettingsService } from './settings.service';

import { PracticeMode } from '../enums/practice-mode.enum';
import { Alphabet } from '../models/alphabet.model';
import { TablesEngine } from '../engines/tables.engine';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly _currentQuestion = signal<Question | null>(null);

  readonly currentQuestion = this._currentQuestion.asReadonly();

  constructor(
    private settingsService: SettingsService,
    private alphabetEngine: AlphabetEngine,
    private tablesEngine: TablesEngine,
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

      // case PracticeMode.Tables:
      //   this._currentQuestion.set(this.tablesEngine.nextQuestion());
      //   break;
    }
  }
}
