import { Injectable } from '@angular/core';

import { PracticeMode } from '../enums/practice-mode.enum';
import { StorageKeys } from '../enums/storage-keys.enum';
import { StorageService } from './storage.service';
import { BookmarkSummary } from '../models/bookmark-summary.model';

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
  private bookmarkLists = new Map<string, any[]>();

  private getList(mode: PracticeMode): any[] {
    let list = this.bookmarkLists.get(mode);

    if (!list) {
      list = [];
      this.bookmarkLists.set(mode, list);
    }

    return list;
  }

  add<T>(mode: PracticeMode, question: T): void {
    const list = this.getList(mode);

    if (!list.includes(question)) {
      list.push(question);
      this.save();
    }
  }

  remove<T>(mode: PracticeMode, question: T): void {
    const list = this.getList(mode);

    const index = list.indexOf(question);

    if (index !== -1) {
      list.splice(index, 1);
      this.save();
    }
  }

  toggle<T>(mode: PracticeMode, question: T): void {
    if (this.isBookmarked(mode, question)) {
      this.remove(mode, question);
    } else {
      this.add(mode, question);
    }
  }

  isBookmarked<T>(mode: PracticeMode, question: T): boolean {
    return this.getList(mode).includes(question);
  }

  getBookmarks<T>(mode: PracticeMode): T[] {
    return [...this.getList(mode)] as T[];
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
      this.bookmarkLists.set(mode, list);
    }
  }

  getAllBookmarks(): ReadonlyMap<string, any[]> {
    return this.bookmarkLists;
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
}
