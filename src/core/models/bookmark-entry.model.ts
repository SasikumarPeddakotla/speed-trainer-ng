import { PracticeMode } from '../enums/practice-mode.enum';

export interface BookmarkEntry<T = unknown> {
  mode: PracticeMode;
  question: T;
}
