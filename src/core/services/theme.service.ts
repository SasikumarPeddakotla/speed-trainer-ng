import { Injectable, signal } from '@angular/core';

import { Theme } from '../enums/theme.enum';
import { StorageKeys } from '../enums/storage-keys.enum';
import { StorageService } from './storage.service';

interface AppSettings {
  theme: Theme;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly DEFAULT_THEME = Theme.Light;

  private readonly _theme = signal<Theme>(this.DEFAULT_THEME);

  readonly theme = this._theme.asReadonly();

  constructor(private storageService: StorageService) {
    this.load();
    this.applyTheme();
  }

  private load(): void {
    const savedSettings = this.storageService.get<AppSettings>(
      StorageKeys.AppSettings,
    );

    if (savedSettings?.theme) {
      this._theme.set(savedSettings.theme);
    }
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);

    this.applyTheme();

    this.storageService.set<AppSettings>(StorageKeys.AppSettings, {
      theme,
    });
  }

  private applyTheme(): void {
    document.documentElement.classList.toggle(
      'dark',
      this._theme() === Theme.Dark,
    );
  }
}
