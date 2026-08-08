import { Injectable } from '@angular/core';
import { SettingsService } from '../core/services/settings.service';
import { SettingType } from '../core/enums/setting-type.enum';

@Injectable({
  providedIn: 'root',
})
export class IdService {
  constructor(private settingsService: SettingsService) {}

  getExerciseKey(): string {
    const settings = this.settingsService.settings();

    const mode = settings.selectedExercise!.mode;
    const hasDirection = settings.selectedExercise?.settings.includes(
      SettingType.Direction,
    );
    const direction = settings.direction;

    return hasDirection ? `${mode}_${direction}` : mode;
  }

  getQuestionId<T>(question: T): string {
    const exerciseKey = this.getExerciseKey();
    return `${exerciseKey}_${question}`;
  }
}
