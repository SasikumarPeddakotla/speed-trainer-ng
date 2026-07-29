import { Component, inject, input } from '@angular/core';

import { TablesEngine } from '../../../core/engines/tables.engine';
import { SettingsService } from '../../../core/services/settings.service';
import { TableQuestion } from '../../../core/models/table-question.model';
import { ReviewService } from '../../../core/services/review.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';

@Component({
  selector: 'app-tables-reference',
  standalone: true,
  imports: [],
  templateUrl: './tables-reference.component.html',
  styleUrl: './tables-reference.component.scss',
})
export class TablesReferenceComponent {
  private tablesEngine = inject(TablesEngine);
  private settingsService = inject(SettingsService);
  private reviewService = inject(ReviewService);

  isWeakMode = input<boolean>();

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  get tables(): number[] {
    if (this.isWeakMode()) {
      return this.reviewService
        .getPendingQuestions<TableQuestion>(this.mode)
        .map((q) => q.table);
    }

    return this.tablesEngine.getTablesReference();
  }

  protected readonly multipliers = Array.from(
    { length: Number(this.settingsService.settings().multiplierLimit) },
    (_, i) => i + 1,
  );
}
