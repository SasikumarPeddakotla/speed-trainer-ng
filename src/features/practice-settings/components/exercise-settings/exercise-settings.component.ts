import { Component, computed, inject, OnInit } from '@angular/core';

import { StateService } from '../../../../core/services/state.service';
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
  readonly denominators = [
    ...Array.from({ length: 15 }, (_, i) => `/${i + 2}`),
    ...[
      '/18',
      '/20',
      '/25',
      '/40',
      '/50',
      '/80',
      '/100',
      '/125',
      '/200',
      '/400',
    ],
  ];

  readonly stateService = inject(StateService);

  private vocabularyEngine = inject(VocabularyEngine);

  get totalWords() {
    return this.vocabularyEngine.getVocabularyCount();
  }

  digitSelectionOperator = computed(() => {
    switch (this.stateService.navigation().selectedExercise?.mode) {
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
    () => this.stateService.navigation().selectedExercise?.mode,
  );
  readonly PracticeMode = PracticeMode;

  hasSetting(setting: SettingType): boolean {
    return (
      this.stateService
        .navigation()
        .selectedExercise?.settings.includes(setting) ?? false
    );
  }

  digitSelection() {
    return this.stateService.practice().digitSelection;
  }

  setDigitSelection(value: string) {
    this.stateService.setDigitSelection(value);
  }

  tableSelection() {
    return this.stateService.practice().tableSelection;
  }

  setTableSelection(value: 'random' | 'custom') {
    this.stateService.setTableSelection(value);
  }

  multiplierLimit() {
    return this.stateService.practice().multiplierLimit;
  }

  setMultiplierLimit(value: string) {
    this.stateService.setMultiplierLimit(value);
  }

  numberRange() {
    return this.stateService.practice().numberRange;
  }

  setNumberRange(value: string) {
    this.stateService.setNumberRange(value);
  }

  selectedTables() {
    return this.stateService.practice().selectedTables;
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

    this.stateService.setSelectedTables(selected);
  }

  isTableSelected(table: number) {
    return this.selectedTables().includes(table);
  }

  wordsLimit() {
    return this.stateService.practice().wordsLimit;
  }

  setWordsLimit(value: number): void {
    value = Number(value);

    if (isNaN(value)) {
      value = 10;
    }

    value = Math.max(10, Math.min(value, this.totalWords));

    this.stateService.setWordsLimit(value.toString());
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
    return this.stateService.practice().denominatorSelection;
  }

  setDenominatorSelection(value: 'all' | 'custom') {
    this.stateService.setDenominatorSelection(value);
  }

  selectedDenominators() {
    return this.stateService.practice().selectedDenominators;
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

    this.stateService.setSelectedDenominators(selected);
  }
}
