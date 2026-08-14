import { Component, computed, inject, input, signal } from '@angular/core';

import { TablesEngine } from '../../../core/engines/tables.engine';
import { StateService } from '../../../core/services/state.service';
import { TableQuestion } from '../../../core/models/table-question.model';
import { ReviewService } from '../../../core/services/review.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { IdService } from '../../../utils/id.service';

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
  private stateService = inject(StateService);
  private reviewService = inject(ReviewService);
  private bookmarkService = inject(BookmarkService);
  private idService = inject(IdService);

  private refreshBookmarks = signal(0);

  referenceTab = input<'all' | 'weak' | 'bookmark'>();

  protected readonly mode = this.stateService.navigation().selectedExercise
    ?.mode as PracticeMode;

  // get tables(): number[] {
  //   if (this.referenceTab()) {
  //     return this.reviewService
  //       .getPendingQuestions<TableQuestion>(this.mode)
  //       .map((q) => q.table);
  //   }

  //   return this.tablesEngine.getTablesReference();
  // }

  protected readonly multipliers = Array.from({ length: 20 }, (_, i) => i + 1);

  readonly tables = computed<TableReference[]>(() => {
    this.refreshBookmarks();
    switch (this.referenceTab()) {
      case 'weak':
        return this.buildTableReference(
          this.reviewService.getPendingQuestions<TableQuestion>(this.mode),
        );

      case 'bookmark':
        return this.buildTableReference(
          this.bookmarkService.getBookmarkedQuestions<TableQuestion>(),
        );

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

  async toggleBookmark(question: TableQuestion): Promise<void> {
    const entry = {
      id: this.idService.getQuestionId(
        `${question.table} × ${question.multiplier}`,
      ),
      mode: this.mode,
      question,
    };

    await this.bookmarkService.toggle(entry);
    this.refreshBookmarks.update((v) => v + 1);
  }

  isBookmarked(question: TableQuestion): boolean {
    return this.bookmarkService.isBookmarked(
      this.idService.getQuestionId(
        `${question.table} × ${question.multiplier}`,
      ),
    );
  }
}
