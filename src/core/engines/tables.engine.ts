import { Injectable } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { Question } from '../models/question.model';
import { TableQuestion } from '../models/table-question.model';

@Injectable({
  providedIn: 'root',
})
export class TablesEngine {
  constructor(private settingsService: SettingsService) {}

  generate(): Question<TableQuestion> {
    const settings = this.settingsService.settings();

    const table =
      settings.tableSelection === 'random'
        ? this.random(2, 20)
        : settings.selectedTables[
            this.random(0, settings.selectedTables.length - 1)
          ];

    const multiplier = this.random(2, Number(settings.multiplierLimit));

    return {
      question: `${table} × ${multiplier}`,
      answer: String(table * multiplier),
      data: {
        table,
        multiplier,
      },
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
