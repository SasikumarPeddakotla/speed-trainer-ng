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
    implemented: true,

    settings: [SettingType.SessionType],
  },
  {
    title: 'Letter → Reverse Position',
    route: 'letter-to-reverse-position',
    mode: PracticeMode.LetterToReversePosition,
    topic: 'alphabet',
    implemented: true,

    settings: [SettingType.SessionType],
  },
  {
    title: 'Reverse Position → Letter',
    route: 'reverse-position-to-letter',
    mode: PracticeMode.ReversePositionToLetter,
    topic: 'alphabet',
    implemented: true,

    settings: [SettingType.SessionType],
  },
  {
    title: 'Mirror Letter',
    route: 'mirror-letter',
    mode: PracticeMode.MirrorLetter,
    topic: 'alphabet',
    implemented: true,

    settings: [SettingType.SessionType],
  },

  {
    title: 'Addition',
    route: 'addition',
    mode: PracticeMode.Addition,
    topic: 'arithmetic',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.DigitSelection],
  },
  {
    title: 'Subtraction',
    route: 'subtraction',
    mode: PracticeMode.Subtraction,
    topic: 'arithmetic',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.DigitSelection],
  },
  {
    title: 'Multiplication',
    route: 'multiplication',
    mode: PracticeMode.Multiplication,
    topic: 'arithmetic',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.DigitSelection],
  },
  {
    title: 'Division',
    route: 'division',
    mode: PracticeMode.Division,
    topic: 'arithmetic',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.DigitSelection],
  },

  {
    title: 'Tables',
    route: 'tables',
    mode: PracticeMode.Tables,
    topic: 'tables',
    implemented: true,

    settings: [
      SettingType.SessionType,
      SettingType.TableSelection,
      SettingType.MultiplierLimit,
    ],
  },

  {
    title: 'Squares',
    route: 'squares',
    mode: PracticeMode.Squares,
    topic: 'powers',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.NumberRange],
  },
  {
    title: 'Cubes',
    route: 'cubes',
    mode: PracticeMode.Cubes,
    topic: 'powers',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.NumberRange],
  },
  {
    title: 'Square Roots',
    route: 'square-roots',
    mode: PracticeMode.SquareRoots,
    topic: 'powers',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.NumberRange],
  },
  {
    title: 'Cube Roots',
    route: 'cube-roots',
    mode: PracticeMode.CubeRoots,
    topic: 'powers',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.NumberRange],
  },

  {
    title: 'Fraction ↔ Decimal',
    route: 'fraction-decimal',
    mode: PracticeMode.FractionDecimal,
    topic: 'conversions',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.Direction],
  },
  {
    title: 'Fraction ↔ Percentage',
    route: 'fraction-percentage',
    mode: PracticeMode.FractionPercentage,
    topic: 'conversions',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.Direction],
  },
  {
    title: 'Decimal ↔ Percentage',
    route: 'decimal-percentage',
    mode: PracticeMode.DecimalPercentage,
    topic: 'conversions',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.Direction],
  },
];
