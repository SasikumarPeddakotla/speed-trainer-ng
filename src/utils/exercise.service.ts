import { Injectable } from '@angular/core';
import { SettingsService } from '../core/services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  constructor(private settingsService: SettingsService) {}

  getExerciseKey(): string {
    const settings = this.settingsService.settings();

    const mode = settings.selectedExercise!.mode;
    const direction = settings.direction;

    return direction ? `${mode}_${direction}` : mode;
  }
}
