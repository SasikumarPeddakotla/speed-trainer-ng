import { Injectable } from '@angular/core';

import { PracticeMode } from '../enums/practice-mode.enum';
import { StorageKeys } from '../enums/storage-keys.enum';
import { StorageService } from './storage.service';
import { BookmarkSummary } from '../models/bookmark-summary.model';
import { BookmarkEntry } from '../models/bookmark-entry.model';
import { Question } from '../models/question.model';

interface BookmarkStorage {
  version: number;
  bookmarks: Record<string, any[]>;
}

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  constructor(private storageService: StorageService) {
    this.load();
  }

  /**
   * One bookmark list per exercise.
   *
   * Example keys:
   * LetterPosition
   * Synonyms
   * Tables
   * Articles
   */
  private bookmarkLists = new Map<PracticeMode, BookmarkEntry[]>();

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
    }
  }

  remove(entry: BookmarkEntry): void {
    const list = this.getList(entry.mode);

    const index = list.findIndex((b) => b.id === entry.id);

    if (index !== -1) {
      list.splice(index, 1);
      this.save();
    }
  }

  toggle(entry: BookmarkEntry): void {
    if (this.isBookmarked(entry.mode, entry.id)) {
      this.remove(entry);
    } else {
      this.add(entry);
    }
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

    if (!storage) {
      return;
    }

    if (storage.version !== 1) {
      return;
    }

    this.bookmarkLists.clear();

    for (const [mode, list] of Object.entries(storage.bookmarks)) {
      this.bookmarkLists.set(mode as PracticeMode, list as BookmarkEntry[]);
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
        mode: mode as PracticeMode,
        count: questions.length,
      }),
    );
  }

  getAllBookmarks(): BookmarkEntry[] {
    return Array.from(this.bookmarkLists.values()).flat();
  }
}
