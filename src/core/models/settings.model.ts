import { SessionType } from '../enums/session-type.enum';
import { Exercise } from './exercise.model';

export interface Settings {
  selectedExercise: Exercise | null;

  tableLimit: string;

  sessionType: SessionType;
}
