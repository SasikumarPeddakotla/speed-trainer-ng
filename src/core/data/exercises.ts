import { PracticeMode } from '../enums/practice-mode.enum';
import { SettingType } from '../enums/setting-type.enum';
import { Exercise } from '../models/exercise.model';

export const exercises: Exercise[] = [
  {
    title: 'Letter → Position',
    route: 'letter-to-position',
    mode: PracticeMode.LetterToPosition,
    topic: 'alphabet',
    implemented: true,

    settings: [SettingType.SessionType],
  },
  {
    title: 'Position → Letter',
    route: 'position-to-letter',
    mode: PracticeMode.PositionToLetter,
    topic: 'alphabet',
    implemented: false,

    settings: [SettingType.SessionType],
  },
  {
    title: 'Letter → Reverse Position',
    route: 'letter-to-reverse-position',
    mode: PracticeMode.LetterToReversePosition,
    topic: 'alphabet',
    implemented: false,

    settings: [SettingType.SessionType],
  },
  {
    title: 'Reverse Position → Letter',
    route: 'reverse-position-to-letter',
    mode: PracticeMode.ReversePositionToLetter,
    topic: 'alphabet',
    implemented: false,

    settings: [SettingType.SessionType],
  },
  {
    title: 'Mirror Letter',
    route: 'mirror-letter',
    mode: PracticeMode.MirrorLetter,
    topic: 'alphabet',
    implemented: false,

    settings: [SettingType.SessionType],
  },
];
