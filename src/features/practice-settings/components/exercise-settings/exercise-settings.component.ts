import { Component, inject } from '@angular/core';

import { SettingsService } from '../../../../core/services/settings.service';
import { SettingType } from '../../../../core/enums/setting-type.enum';
import { FormsModule } from '@angular/forms';

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

  readonly settingsService = inject(SettingsService);

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
}
