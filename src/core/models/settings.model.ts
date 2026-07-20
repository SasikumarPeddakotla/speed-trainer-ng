import { SessionType } from '../enums/session-type.enum';
import { Exercise } from './exercise.model';

export interface Settings {
  selectedExercise: Exercise | null;

  digitSelection: string;

  tableSelection: 'random' | 'custom';
  selectedTables: number[];

  multiplierLimit: string;

  numberRange: string;

  sessionType: SessionType;

  countdownDuration: number;

  questionTarget: number;

  direction: 'forward' | 'backward';
}
