import { Injectable } from '@angular/core';
import { SettingsService } from '../core/services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class IdService {
  constructor(private settingsService: SettingsService) {}

  /**
   * Returns the currently selected exercise mode.
   *
   * Examples:
   * - LetterToPosition
   * - PositionToLetter
   * - FractionToDecimal
   * - Synonyms
   */
  getExerciseKey(): string {
    return this.settingsService.settings().selectedExercise!.mode;
  }

  /**
   * Creates a unique question id for the current question.
   *
   * Examples:
   * - LetterToPosition_A
   * - PositionToLetter_1
   * - FractionToDecimal_1/4
   * - Synonyms_Lucidity
   */
  getQuestionId(question: string | number): string {
    return `${this.getExerciseKey()}_${question}`;
  }
}
