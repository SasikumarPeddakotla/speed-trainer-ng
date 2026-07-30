import { Component, computed, inject, input } from '@angular/core';

import { TablesEngine } from '../../../core/engines/tables.engine';
import { SettingsService } from '../../../core/services/settings.service';
import { TableQuestion } from '../../../core/models/table-question.model';
import { ReviewService } from '../../../core/services/review.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { BookmarkService } from '../../../core/services/bookmark.service';

interface TableReference {
  table: number;
  questions: TableQuestion[];
}

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
  private bookmarkService = inject(BookmarkService);

  private removedBookmarks = new Set<unknown>();

  referenceTab = input<'all' | 'weak' | 'bookmark'>();

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  // get tables(): number[] {
  //   if (this.referenceTab()) {
  //     return this.reviewService
  //       .getPendingQuestions<TableQuestion>(this.mode)
  //       .map((q) => q.table);
  //   }

  //   return this.tablesEngine.getTablesReference();
  // }

  protected readonly multipliers = Array.from(
    { length: Number(this.settingsService.settings().multiplierLimit) },
    (_, i) => i + 1,
  );

  readonly tables = computed<TableReference[]>(() => {
    switch (this.referenceTab()) {
      case 'weak':
        return this.buildTableReference(
          this.reviewService.getPendingQuestions<TableQuestion>(this.mode),
        );

      case 'bookmark':
        return this.buildTableReference([
          ...this.bookmarkService.getBookmarks<TableQuestion>(this.mode),
        ]);

      default:
        return this.tablesEngine.getTablesReference().map((table) => ({
          table,
          questions: this.multipliers.map((multiplier) => ({
            table,
            multiplier,
          })),
        }));
    }
  });

  private buildTableReference(questions: TableQuestion[]): TableReference[] {
    const grouped = new Map<number, TableQuestion[]>();

    for (const question of questions) {
      if (!grouped.has(question.table)) {
        grouped.set(question.table, []);
      }

      grouped.get(question.table)!.push(question);
    }

    return [...grouped.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([table, questions]) => ({
        table,
        questions: questions.sort((a, b) => a.multiplier - b.multiplier),
      }));
  }

  toggleBookmark(question: TableQuestion): void {
    const entry = {
      id: `table:${question.table}:${question.multiplier}`,
      mode: this.mode,
      question,
    };

    if (this.removedBookmarks.has(question)) {
      this.bookmarkService.add(entry);
      this.removedBookmarks.delete(question);
    } else {
      this.bookmarkService.remove(entry);
      this.removedBookmarks.add(question);
    }
  }

  isRemoved(question: unknown): boolean {
    return this.removedBookmarks.has(question);
  }
}
