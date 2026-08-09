import { Injectable } from '@angular/core';

import { StorageKeys } from '../enums/storage-keys.enum';
import { StorageService } from './storage.service';
import { BookmarkSummary } from '../models/bookmark-summary.model';
import { BookmarkEntry } from '../models/bookmark-entry.model';
import { DialogService } from './dialog.service';
import { SnackbarService } from './snackbar.service';
import { IdService } from '../../utils/id.service';

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
    private idService: IdService,
  ) {
    this.load();
  }

  /**
   * One bookmark list per exercise key.
   *
   * Example keys:
   * - LetterPosition
   * - LetterPosition
   * - Synonyms
   * - Articles
   */
  private bookmarkLists = new Map<string, BookmarkEntry[]>();

  private currentBookmark?: BookmarkEntry;

  getCurrentBookmark(): BookmarkEntry | undefined {
    return this.currentBookmark;
  }

  setCurrentBookmark(bookmark: BookmarkEntry | undefined): void {
    this.currentBookmark = bookmark;
  }

  private getExerciseKey(): string {
    return this.idService.getExerciseKey();
  }

  private getList(exerciseKey: string): BookmarkEntry[] {
    let list = this.bookmarkLists.get(exerciseKey);

    if (!list) {
      list = [];
      this.bookmarkLists.set(exerciseKey, list);
    }

    return list;
  }

  add(entry: BookmarkEntry): void {
    const exerciseKey = this.getExerciseKey();
    const list = this.getList(exerciseKey);

    if (!list.some((b) => b.id === entry.id)) {
      list.push(entry);

      this.save();

      this.snackbarService.show('Added to bookmarks');
    }
  }

  private removeInternal(entry: BookmarkEntry): void {
    const exerciseKey = this.getExerciseKey();
    const list = this.getList(exerciseKey);

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

        onCancel: () => {
          resolve(false);
        },
      });
    });
  }

  async toggle(entry: BookmarkEntry): Promise<boolean> {
    if (this.isBookmarked(entry.id)) {
      return await this.remove(entry);
    }

    this.add(entry);

    return true;
  }

  isBookmarked(id: string): boolean {
    const exerciseKey = this.getExerciseKey();

    return this.getList(exerciseKey).some((b) => b.id === id);
  }

  // Returns only questionData as an array. For reference pages to show in the bookmarks tab.
  getBookmarkedQuestions<T>(): T[] {
    const exerciseKey = this.getExerciseKey();

    return this.getList(exerciseKey).map((b) => b.question as T);
  }

  clearCurrentExercise(): void {
    const exerciseKey = this.getExerciseKey();

    this.bookmarkLists.delete(exerciseKey);

    this.save();
  }

  clearAll(): void {
    this.bookmarkLists.clear();

    this.storageService.remove(StorageKeys.Bookmarks);
  }

  private save(): void {
    const storage: BookmarkStorage = {
      version: 1,

      bookmarks: Object.fromEntries(this.bookmarkLists),
    };

    this.storageService.set(StorageKeys.Bookmarks, storage);
    this.load();
  }

  private load(): void {
    const storage = this.storageService.get<BookmarkStorage>(
      StorageKeys.Bookmarks,
    );

    if (!storage || storage.version !== 1) {
      return;
    }

    this.bookmarkLists.clear();

    for (const [exerciseKey, list] of Object.entries(storage.bookmarks)) {
      this.bookmarkLists.set(exerciseKey, list);
    }
  }

  getTotalBookmarks(): number {
    let total = 0;

    for (const list of this.bookmarkLists.values()) {
      total += list.length;
    }

    return total;
  }

  getBookmarkSummaries(): BookmarkSummary[] {
    return Array.from(this.bookmarkLists.entries()).map(
      ([exerciseKey, questions]) => ({
        exerciseKey: exerciseKey,

        count: questions.length,
      }),
    );
  }

  // Returns an array of all bookmarks. For bookmark engine to show questions one by one.
  getAllBookmarks(): BookmarkEntry[] {
    return Array.from(this.bookmarkLists.values()).flat();
  }

  getBookmarkCountForExerciseKey(exerciseKey: string): number {
    return this.getList(exerciseKey).length;
  }
}
