import { Injectable, inject } from '@angular/core';

import { AppSettingsService } from './app-settings.service';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private readonly appSettingsService = inject(AppSettingsService);

  private readonly correctSound = new Audio('/sounds/correct.mp3');
  private readonly wrongSound = new Audio('/sounds/wrong.mp3');

  playCorrect(): void {
    if (!this.appSettingsService.settings().sound) {
      return;
    }

    this.play(this.correctSound);
  }

  playWrong(): void {
    if (!this.appSettingsService.settings().sound) {
      return;
    }

    this.play(this.wrongSound);
  }

  private play(audio: HTMLAudioElement): void {
    audio.currentTime = 0;

    audio.play().catch(() => {
      // Ignore playback errors caused by browser restrictions.
    });
  }
}
