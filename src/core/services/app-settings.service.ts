import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

import { AppSettings, Theme } from '../models/app-settings.model';
import { StorageKeys } from '../enums/storage-keys.enum';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  private readonly storageService = inject(StorageService);
  private readonly document = inject(DOCUMENT);

  private readonly DEFAULT_SETTINGS: AppSettings = {
    theme: 'system',
    sound: true,
  };

  private readonly _settings = signal<AppSettings>(this.loadSettings());

  readonly settings = this._settings.asReadonly();

  private mediaQuery?: MediaQueryList;

  constructor() {
    this.applyTheme(this.settings().theme);

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.mediaQuery.addEventListener('change', () => {
      if (this.settings().theme === 'system') {
        this.applyTheme('system');
      }
    });
  }

  setTheme(theme: Theme): void {
    this._settings.update((settings) => ({
      ...settings,
      theme,
    }));

    this.save();

    this.applyTheme(theme);
  }

  setSound(enabled: boolean): void {
    this._settings.update((settings) => ({
      ...settings,
      sound: enabled,
    }));

    this.save();
  }

  private loadSettings(): AppSettings {
    const saved = this.storageService.get<Partial<AppSettings>>(
      StorageKeys.AppSettings,
    );

    return {
      ...this.DEFAULT_SETTINGS,
      ...saved,
    };
  }

  private save(): void {
    this.storageService.set(StorageKeys.AppSettings, this._settings());
  }

  private applyTheme(theme: Theme): void {
    const root = this.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;

      root.classList.add(prefersDark ? 'dark' : 'light');

      return;
    }

    root.classList.add(theme);
  }
}
