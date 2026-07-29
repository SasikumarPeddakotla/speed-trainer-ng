import { PracticeMode } from '../enums/practice-mode.enum';

export interface ReviewQueueSummary {
  mode: PracticeMode;
  count: number;
}
