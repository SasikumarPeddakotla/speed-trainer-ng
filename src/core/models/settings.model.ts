import { PracticeMode } from '../enums/practice-mode.enum';
import { SessionType } from '../enums/session-type.enum';

export interface Settings {
  mode: PracticeMode;

  difficulty: string;

  tableLimit: string;

  sessionType: SessionType;
}
