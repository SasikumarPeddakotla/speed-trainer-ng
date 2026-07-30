import { PracticeMode } from '../enums/practice-mode.enum';

export interface BookmarkEntry<T = unknown> {
  id: string;
  mode: PracticeMode;
  question: T;
}
