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
    tableLimit: '20',
    sessionType: SessionType.Practice,
  });

  readonly settings = this._settings.asReadonly();

  setExercise(exercise: Exercise) {
    this._settings.update((settings) => ({
      ...settings,
      selectedExercise: exercise,
    }));
  }

  setSessionType(sessionType: SessionType) {
    this._settings.update((settings) => ({
      ...settings,
      sessionType,
    }));
  }
}
