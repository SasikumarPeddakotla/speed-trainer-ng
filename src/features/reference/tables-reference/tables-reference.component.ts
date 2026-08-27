import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { TablesEngine } from '../../../core/engines/tables.engine';
import { StateService } from '../../../core/services/state.service';
import { TableQuestion } from '../../../core/models/table-question.model';
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
  private bookmarkService = inject(BookmarkService);
  private idService = inject(IdService);

  private refreshBookmarks = signal(0);

  referenceTab = input<'all' | 'bookmark'>();
  count = output<{
    allCount: number;
    bookmarkCount: number;
  }>();

  protected readonly mode = this.stateService.navigation().selectedExercise
    ?.mode as PracticeMode;

  private readonly allQuestions = computed(() => {
    return this.tablesEngine.getTablesReference();
  });
  private readonly bookmarkQuestions = computed(() => {
    return this.bookmarkService.getBookmarkedQuestions<TableQuestion>();
  });

  // To return the counts to parent
  private readonly emitCountsEffect = effect(() => {
    this.count.emit({
      allCount: this.allQuestions().length,
      bookmarkCount: this.bookmarkQuestions().length,
    });
  });

  readonly tables = computed<TableReference[]>(() => {
    this.refreshBookmarks();
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.buildTableReference(this.bookmarkQuestions());

      default:
        return this.buildTableReference(this.allQuestions());
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
