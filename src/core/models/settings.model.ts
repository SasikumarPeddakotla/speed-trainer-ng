import { Subject } from './subject.model';
import { SessionType } from '../enums/session-type.enum';
import { Exercise } from './exercise.model';
import { Topic } from './topic.model';

export interface Settings {
  selectedSubject: Subject | null;
  selectedTopic: Topic | null;
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

  wordsLimit: string;

  referenceView: 'all' | 'weak' | 'bookmark';
}
