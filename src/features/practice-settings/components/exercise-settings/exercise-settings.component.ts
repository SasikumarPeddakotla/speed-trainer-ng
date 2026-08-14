import { Component, computed, inject, OnInit } from '@angular/core';

import { SettingsService } from '../../../../core/services/settings.service';
import { SettingType } from '../../../../core/enums/setting-type.enum';
import { FormsModule } from '@angular/forms';
import { PracticeMode } from '../../../../core/enums/practice-mode.enum';
import { VocabularyEngine } from '../../../../core/engines/vocabulary.engine';

@Component({
  selector: 'app-exercise-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './exercise-settings.component.html',
  styleUrl: './exercise-settings.component.scss',
})
export class ExerciseSettingsComponent {
  readonly SettingType = SettingType;
  readonly tables = Array.from({ length: 19 }, (_, i) => i + 2);
  readonly denominators = Array.from({ length: 15 }, (_, i) => `/${i + 2}`);

  readonly settingsService = inject(SettingsService);

  private vocabularyEngine = inject(VocabularyEngine);

  get totalWords() {
    return this.vocabularyEngine.getVocabularyCount();
  }

  digitSelectionOperator = computed(() => {
    switch (this.settingsService.settings().selectedExercise?.mode) {
      case PracticeMode.Addition:
        return '+';

      case PracticeMode.Subtraction:
        return '-';

      case PracticeMode.Multiplication:
        return '×';

      case PracticeMode.Division:
        return '÷';

      default:
        return '&';
    }
  });

  readonly mode = computed(
    () => this.settingsService.settings().selectedExercise?.mode,
  );
  readonly PracticeMode = PracticeMode;

  hasSetting(setting: SettingType): boolean {
    return (
      this.settingsService
        .settings()
        .selectedExercise?.settings.includes(setting) ?? false
    );
  }

  digitSelection() {
    return this.settingsService.settings().digitSelection;
  }

  setDigitSelection(value: string) {
    this.settingsService.setDigitSelection(value);
  }

  tableSelection() {
    return this.settingsService.settings().tableSelection;
  }

  setTableSelection(value: 'random' | 'custom') {
    this.settingsService.setTableSelection(value);
  }

  multiplierLimit() {
    return this.settingsService.settings().multiplierLimit;
  }

  setMultiplierLimit(value: string) {
    this.settingsService.setMultiplierLimit(value);
  }

  numberRange() {
    return this.settingsService.settings().numberRange;
  }

  setNumberRange(value: string) {
    this.settingsService.setNumberRange(value);
  }

  selectedTables() {
    return this.settingsService.settings().selectedTables;
  }

  toggleTable(table: number) {
    const selected = [...this.selectedTables()];

    const index = selected.indexOf(table);

    if (index === -1) {
      selected.push(table);
    } else {
      // Don't allow removing the last selected table
      if (selected.length === 1) {
        return;
      }

      selected.splice(index, 1);
    }

    selected.sort((a, b) => a - b);

    this.settingsService.setSelectedTables(selected);
  }

  isTableSelected(table: number) {
    return this.selectedTables().includes(table);
  }

  wordsLimit() {
    return this.settingsService.settings().wordsLimit;
  }

  setWordsLimit(value: number): void {
    value = Number(value);

    if (isNaN(value)) {
      value = 10;
    }

    value = Math.max(10, Math.min(value, this.totalWords));

    this.settingsService.setWordsLimit(value.toString());
  }

  increaseWordsLimit() {
    const current = Number(this.wordsLimit());

    this.setWordsLimit(Math.min(current + 10, this.totalWords));
  }

  decreaseWordsLimit() {
    const current = Number(this.wordsLimit());

    this.setWordsLimit(Math.max(current - 10, 10));
  }

  validateWordsLimit(input: HTMLInputElement): void {
    let value = Number(input.value);

    if (isNaN(value)) {
      value = 10;
    }

    value = Math.max(10, Math.min(value, this.totalWords));

    input.value = value.toString();

    this.setWordsLimit(value);
  }

  denominatorSelection() {
    return this.settingsService.settings().denominatorSelection;
  }

  setDenominatorSelection(value: 'all' | 'custom') {
    this.settingsService.setDenominatorSelection(value);
  }

  selectedDenominators() {
    return this.settingsService.settings().selectedDenominators;
  }

  isDenominatorSelected(denominator: string) {
    return this.selectedDenominators().includes(denominator);
  }

  toggleDenominator(denominator: string) {
    const selected = [...this.selectedDenominators()];

    const index = selected.indexOf(denominator);

    if (index === -1) {
      selected.push(denominator);
    } else {
      // Don't allow removing the last selected table
      if (selected.length === 1) {
        return;
      }

      selected.splice(index, 1);
    }

    selected.sort((a, b) => Number(a.at(-1)) - Number(b.at(-1)));

    this.settingsService.setSelectedDenominators(selected);
  }
}
