import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { PracticeMode } from '../../core/enums/practice-mode.enum';
import { BookmarkService } from '../../core/services/bookmark.service';
import { DataService } from '../../core/services/data.service';
import { StateService } from '../../core/services/state.service';

import { NotesReferenceComponent } from './notes-reference/notes-reference.component';
import { ReferenceTableComponent } from './reference-table/reference-table.component';

import { ReferenceData } from '../../core/models/reference-data.model';

interface ReferenceCounts {
  allCount: number;
  bookmarkCount: number;
}

@Component({
  selector: 'app-reference',
  standalone: true,
  imports: [NotesReferenceComponent, ReferenceTableComponent],
  templateUrl: './reference.component.html',
  styleUrl: './reference.component.scss',
})
export class ReferenceComponent {
  private stateService = inject(StateService);
  private router = inject(Router);
  private dataService = inject(DataService);
  private bookmarkService = inject(BookmarkService);

  protected readonly referenceTab = computed(
    () => this.stateService.navigation().referenceView,
  );

  protected readonly topic = this.stateService.navigation().selectedTopic;

  protected readonly exercise = this.stateService.navigation().selectedExercise;

  protected readonly searchText = signal('');

  protected readonly showInfo = signal(false);

  protected readonly allRows = computed<ReferenceData[]>(() => {
    return this.dataService.getCurrentReferenceData();
  });

  protected readonly bookmarkRows = computed<ReferenceData[]>(() => {
    return this.bookmarkService.getBookmarkedQuestions<ReferenceData>();
  });

  protected readonly referenceRows = computed(() => {
    const rows =
      this.referenceTab() === 'bookmark' ? this.bookmarkRows() : this.allRows();

    const search = this.searchText().trim().toLowerCase();

    if (!search) {
      return rows;
    }

    const columns = this.exercise?.referenceColumns ?? [];

    return rows.filter((row) => {
      const searchableRow = row as unknown as Record<string, unknown>;

      return columns.some((column) => {
        const value = searchableRow[column.key];

        return String(value ?? '')
          .toLowerCase()
          .includes(search);
      });
    });
  });

  protected readonly counts = computed<ReferenceCounts>(() => {
    return {
      allCount: this.allRows().length,
      bookmarkCount: this.bookmarkRows().length,
    };
  });

  protected readonly isBookmarked = (row: { id: string }): boolean => {
    return this.bookmarkService.isBookmarked(row.id);
  };

  async ngOnInit(): Promise<void> {
    await this.dataService.preloadForMode(
      this.stateService.navigation().selectedExercise?.mode,
    );
  }

  toggleInfo(event: MouseEvent): void {
    event.stopPropagation();
    this.showInfo.update((value) => !value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.info-button') && !target.closest('.info-popover')) {
      this.showInfo.set(false);
    }
  }

  showQuestions(referenceView: 'all' | 'bookmark'): void {
    this.stateService.setReferenceView(referenceView);
    this.showInfo.set(false);
  }

  protected async toggleBookmark(row: { id: string }): Promise<void> {
    await this.bookmarkService.toggle({
      id: row.id,
      mode: this.exercise?.mode as PracticeMode,
      question: row,
    });
  }

  practice(): void {
    this.stateService.setReferenceCounts(this.counts());

    this.stateService.resetPractice();

    this.router.navigate([this.exercise?.route, 'practice-settings']);
  }
}
