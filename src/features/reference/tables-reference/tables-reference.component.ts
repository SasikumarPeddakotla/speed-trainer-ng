import { Component, inject } from '@angular/core';

import { TablesEngine } from '../../../core/engines/tables.engine';
import { SettingsService } from '../../../core/services/settings.service';

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

  protected readonly tables = this.tablesEngine.getTablesReference();

  protected readonly multipliers = Array.from(
    { length: Number(this.settingsService.settings().multiplierLimit) },
    (_, i) => i + 1,
  );
}
