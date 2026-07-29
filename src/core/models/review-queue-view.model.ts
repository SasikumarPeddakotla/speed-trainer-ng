import { PracticeMode } from '../enums/practice-mode.enum';

export interface ReviewQueueView {
  title: string;
  mode: PracticeMode;
  count: number;
}
