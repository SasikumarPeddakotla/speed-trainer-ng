import { PracticeMode } from '../enums/practice-mode.enum';
import { SettingType } from '../enums/setting-type.enum';

export interface Exercise {
  title: string;

  route: string;
  mode: PracticeMode;

  topic: string;

  implemented: boolean;
  settings: SettingType[];
}
