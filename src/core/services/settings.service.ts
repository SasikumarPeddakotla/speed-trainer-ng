import { Injectable, signal } from '@angular/core';

import { Settings } from '../models/settings.model';
import { PracticeMode } from '../enums/practice-mode.enum';
import { SessionType } from '../enums/session-type.enum';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly _settings = signal<Settings>({
    mode: PracticeMode.LetterToPosition,
    difficulty: '1',
    tableLimit: '20',
    sessionType: SessionType.Practice,
  });

  readonly settings = this._settings.asReadonly();

  setMode(mode: PracticeMode) {
    this._settings.update((settings) => ({
      ...settings,
      mode,
    }));
  }
}
