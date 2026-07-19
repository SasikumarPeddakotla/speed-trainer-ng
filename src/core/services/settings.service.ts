import { Injectable, signal } from '@angular/core';

import { Settings } from '../models/settings.model';
import { PracticeMode } from '../enums/practice-mode.enum';
import { SessionType } from '../enums/session-type.enum';
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly _settings = signal<Settings>({
    selectedExercise: null,

    digitSelection: '1x1',

    tableSelection: 'random',
    selectedTables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    multiplierLimit: '10',

    numberRange: '20',

    sessionType: SessionType.Practice,

    countdownDuration: 60,
    questionTarget: 10,
  });

  readonly settings = this._settings.asReadonly();

  setExercise(exercise: Exercise) {
    this._settings.update((settings) => ({
      ...settings,
      selectedExercise: exercise,
    }));
  }

  setTableSelection(tableSelection: 'random' | 'custom') {
    this._settings.update((settings) => ({
      ...settings,
      tableSelection: tableSelection,
    }));
  }

  setDigitSelection(digit: string) {
    this._settings.update((settings) => ({
      ...settings,
      digitSelection: digit,
    }));
  }

  setSessionType(sessionType: SessionType) {
    this._settings.update((settings) => ({
      ...settings,
      sessionType,
    }));
  }

  setCountdownDuration(seconds: number) {
    this._settings.update((settings) => ({
      ...settings,
      countdownDuration: seconds,
    }));
  }

  setQuestionTarget(count: number) {
    this._settings.update((settings) => ({
      ...settings,
      questionTarget: count,
    }));
  }

  setMultiplierLimit(limit: string) {
    this._settings.update((settings) => ({
      ...settings,
      multiplierLimit: limit,
    }));
  }

  setNumberRange(range: string) {
    this._settings.update((settings) => ({
      ...settings,
      numberRange: range,
    }));
  }

  setSelectedTables(selectedTables: number[]) {
    this._settings.update((settings) => ({
      ...settings,
      selectedTables,
    }));
  }
}
