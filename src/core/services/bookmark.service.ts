import { Injectable } from '@angular/core';

import { PracticeMode } from '../enums/practice-mode.enum';
import { StorageKeys } from '../enums/storage-keys.enum';
import { StorageService } from './storage.service';
import { BookmarkSummary } from '../models/bookmark-summary.model';
import { BookmarkEntry } from '../models/bookmark-entry.model';
import { DialogService } from './dialog.service';
import { SnackbarService } from './snackbar.service';

interface BookmarkStorage {
  version: number;
  bookmarks: Record<string, BookmarkEntry[]>;
}

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  constructor(
    private storageService: StorageService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
  ) {
    this.load();
  }

  private bookmarkLists = new Map<PracticeMode, BookmarkEntry[]>();

  private currentBookmark?: BookmarkEntry;

  getCurrentBookmark(): BookmarkEntry | undefined {
    return this.currentBookmark;
  }

  setCurrentBookmark(bookmark: BookmarkEntry | undefined): void {
    this.currentBookmark = bookmark;
  }

  private getList(mode: PracticeMode): BookmarkEntry[] {
    let list = this.bookmarkLists.get(mode);

    if (!list) {
      list = [];
      this.bookmarkLists.set(mode, list);
    }

    return list;
  }

  add(entry: BookmarkEntry): void {
    const list = this.getList(entry.mode);

    if (!list.some((b) => b.id === entry.id)) {
      list.push(entry);
      this.save();

      this.snackbarService.show('Added to bookmarks');
    }
  }

  private removeInternal(entry: BookmarkEntry): void {
    const list = this.getList(entry.mode);

    const index = list.findIndex((b) => b.id === entry.id);

    if (index !== -1) {
      list.splice(index, 1);
      this.save();

      this.snackbarService.show('Removed from bookmarks');
    }
  }

  remove(entry: BookmarkEntry): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialogService.openConfirm({
        title: 'Remove bookmark',
        message: 'Remove this item from bookmarks?',
        confirmText: 'Remove',
        cancelText: 'Cancel',
        onConfirm: () => {
          this.removeInternal(entry);
          resolve(true);
        },
      });

      // If dialog closes without confirmation
      const originalClose = this.dialogService.close.bind(this.dialogService);

      this.dialogService.close = () => {
        originalClose();
        resolve(false);
      };
    });
  }

  async toggle(entry: BookmarkEntry): Promise<boolean> {
    if (this.isBookmarked(entry.mode, entry.id)) {
      return await this.remove(entry);
    }

    this.add(entry);
    return true;
  }

  isBookmarked(mode: PracticeMode, id: string): boolean {
    return this.getList(mode).some((b) => b.id === id);
  }

  getBookmarks<T>(mode: PracticeMode): T[] {
    return this.getList(mode).map((b) => b.question as T);
  }

  getBookmarkCount(mode: PracticeMode): number {
    return this.getList(mode).length;
  }

  clearMode(mode: PracticeMode): void {
    this.bookmarkLists.delete(mode);
    this.save();
  }

  clear(): void {
    this.bookmarkLists.clear();
    this.storageService.remove(StorageKeys.Bookmarks);
  }

  private save(): void {
    const storage: BookmarkStorage = {
      version: 1,
      bookmarks: Object.fromEntries(this.bookmarkLists),
    };

    this.storageService.set(StorageKeys.Bookmarks, storage);
  }

  private load(): void {
    const storage = this.storageService.get<BookmarkStorage>(
      StorageKeys.Bookmarks,
    );

    if (!storage || storage.version !== 1) {
      return;
    }

    this.bookmarkLists.clear();

    for (const [mode, list] of Object.entries(storage.bookmarks)) {
      this.bookmarkLists.set(mode as PracticeMode, list);
    }
  }

  getTotalBookmarks(): number {
    let total = 0;

    for (const list of this.bookmarkLists.values()) {
      total += list.length;
    }

    return total;
  }

  hasBookmarks(mode: PracticeMode): boolean {
    return this.getBookmarkCount(mode) > 0;
  }

  getBookmarkSummaries(): BookmarkSummary[] {
    return Array.from(this.bookmarkLists.entries()).map(
      ([mode, questions]) => ({
        mode,
        count: questions.length,
      }),
    );
  }

  getAllBookmarks(): BookmarkEntry[] {
    return Array.from(this.bookmarkLists.values()).flat();
  }
}
