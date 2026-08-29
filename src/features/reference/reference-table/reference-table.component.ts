import { Component, input, output, signal } from '@angular/core';

import { ReferenceData } from '../../../core/models/reference-data.model';

export interface ReferenceColumn {
  header: string;
  key: string;
}

@Component({
  selector: 'app-reference-table',
  standalone: true,
  imports: [],
  templateUrl: './reference-table.component.html',
  styleUrl: './reference-table.component.scss',
})
export class ReferenceTableComponent {
  readonly rows = input<ReferenceData[]>([]);
  readonly columns = input<ReferenceColumn[]>([]);

  readonly expandable = input(false);

  readonly expandedColumns = input<ReferenceColumn[]>([]);

  readonly isBookmarked = input.required<(row: ReferenceData) => boolean>();

  readonly bookmarkToggle = output<ReferenceData>();

  private readonly expandedRows = signal<Set<string>>(new Set());

  private readonly revealedRows = signal<Set<string>>(new Set());

  private readonly allRevealed = signal(false);

  isExpanded(row: ReferenceData): boolean {
    return this.expandedRows().has(row.id);
  }

  toggleExpanded(row: ReferenceData): void {
    if (!this.expandable()) {
      return;
    }

    this.expandedRows.update((expanded) => {
      const next = new Set(expanded);

      if (next.has(row.id)) {
        next.delete(row.id);
      } else {
        next.add(row.id);
      }

      return next;
    });
  }

  getValue(row: ReferenceData, key: string): unknown {
    return (row as unknown as Record<string, unknown>)[key];
  }

  onBookmarkToggle(row: ReferenceData, event: MouseEvent): void {
    event.stopPropagation();

    this.bookmarkToggle.emit(row);
  }

  getArrayValue(row: ReferenceData, key: string): string[] {
    const value = this.getValue(row, key);

    return Array.isArray(value) ? value.map(String) : [];
  }

  isSecondColumnRevealed(row: ReferenceData): boolean {
    return this.allRevealed() || this.revealedRows().has(row.id);
  }

  toggleSecondColumn(row: ReferenceData, event?: MouseEvent): void {
    event?.stopPropagation();

    this.revealedRows.update((revealed) => {
      const next = new Set(revealed);

      if (next.has(row.id)) {
        next.delete(row.id);
      } else {
        next.add(row.id);
      }

      return next;
    });
  }

  toggleAllSecondColumn(event: MouseEvent): void {
    event.stopPropagation();

    this.allRevealed.update((revealed) => !revealed);

    // Clear individual states when using the header toggle.
    this.revealedRows.set(new Set());
  }

  isAllSecondColumnRevealed(): boolean {
    return this.allRevealed();
  }
}
