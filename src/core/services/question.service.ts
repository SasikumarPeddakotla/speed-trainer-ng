import { Injectable, signal } from '@angular/core';

import { AlphabetEngine } from '../engines/alphabet.engine';

import { Question } from '../models/question.model';

import { SettingsService } from './settings.service';

import { PracticeMode } from '../enums/practice-mode.enum';
import { Alphabet } from '../models/alphabet.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly _currentQuestion = signal<Question | null>(null);

  readonly currentQuestion = this._currentQuestion.asReadonly();

  constructor(
    private settingsService: SettingsService,
    private alphabetEngine: AlphabetEngine,
  ) {}

  nextQuestion() {
    switch (this.settingsService.settings().selectedExercise?.mode) {
      case PracticeMode.LetterToPosition:
        this._currentQuestion.set(this.alphabetEngine.letterToPosition());

        break;
    }
  }

  scheduleReview(data: unknown) {
    switch (this.settingsService.settings().selectedExercise?.mode) {
      case PracticeMode.LetterToPosition:
        this.alphabetEngine.scheduleReview(data as Alphabet);
        break;
    }
  }
}
