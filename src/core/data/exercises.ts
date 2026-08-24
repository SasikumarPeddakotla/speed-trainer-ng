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
    route: 'letter-to-reversePosition',
    mode: PracticeMode.LetterToReversePosition,
    topic: 'alphabet',
    implemented: true,

    settings: [SettingType.SessionType],
  },
  {
    title: 'Reverse Position → Letter',
    route: 'reversePosition-to-letter',
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
    title: 'Fraction → Decimal',
    route: 'fraction-to-decimal',
    mode: PracticeMode.FractionToDecimal,
    topic: 'conversions',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.Denominator],
  },
  {
    title: 'Decimal → Fraction',
    route: 'decimal-to-fraction',
    mode: PracticeMode.DecimalToFraction,
    topic: 'conversions',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.Denominator],
  },
  {
    title: 'Fraction → Percentage',
    route: 'fraction-to-percentage',
    mode: PracticeMode.FractionToPercentage,
    topic: 'conversions',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.Denominator],
  },
  {
    title: 'Percentage → Fraction',
    route: 'percentage-to-fraction',
    mode: PracticeMode.PercentageToFraction,
    topic: 'conversions',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.Denominator],
  },
  {
    title: 'Decimal → Percentage',
    route: 'decimal-to-percentage',
    mode: PracticeMode.DecimalToPercentage,
    topic: 'conversions',
    implemented: true,

    settings: [SettingType.SessionType],
  },
  {
    title: 'Percentage → Decimal',
    route: 'percentage-to-decimal',
    mode: PracticeMode.PercentageToDecimal,
    topic: 'conversions',
    implemented: true,

    settings: [SettingType.SessionType],
  },

  {
    title: 'Article → Title',
    route: 'article-to-title',
    mode: PracticeMode.ArticleToTitle,
    topic: 'polity',
    implemented: true,

    settings: [SettingType.SessionType],
  },
  {
    title: 'Title → Article',
    route: 'title-to-article',
    mode: PracticeMode.TitleToArticle,
    topic: 'polity',
    implemented: true,

    settings: [SettingType.SessionType],
  },

  // English
  {
    title: 'Synonyms',
    route: 'synonyms',
    mode: PracticeMode.Synonyms,
    topic: 'vocabulary',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.WordsLimit],
  },
  {
    title: 'Antonyms',
    route: 'antonyms',
    mode: PracticeMode.Antonyms,
    topic: 'vocabulary',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.WordsLimit],
  },
  {
    title: 'One Word Substitutions',
    route: 'one-word-substitutions',
    mode: PracticeMode.OneWord,
    topic: 'vocabulary',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.WordsLimit],
  },
  {
    title: 'Idioms',
    route: 'idioms',
    mode: PracticeMode.Idioms,
    topic: 'vocabulary',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.WordsLimit],
  },
  {
    title: 'Phrasal Verbs',
    route: 'phrasal-verbs',
    mode: PracticeMode.PhrasalVerbs,
    topic: 'vocabulary',
    implemented: true,

    settings: [SettingType.SessionType, SettingType.WordsLimit],
  },
];
