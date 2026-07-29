import { Component, inject } from '@angular/core';

import { TablesEngine } from '../../../core/engines/tables.engine';
import { SettingsService } from '../../../core/services/settings.service';
import { TableQuestion } from '../../../core/models/table-question.model';
import { StudyListService } from '../../../core/services/study-list.service';

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

  private studyListService = inject(StudyListService);

  protected readonly tables =
    this.studyListService.getQuestions<TableQuestion>()?.map((q) => q.table) ??
    this.tablesEngine.getTablesReference();

  protected readonly multipliers = Array.from(
    { length: Number(this.settingsService.settings().multiplierLimit) },
    (_, i) => i + 1,
  );
}
