import { PracticeMode } from '../enums/practice-mode.enum';
import { SettingType } from '../enums/setting-type.enum';
import { Exercise } from '../models/exercise.model';

export const exercises: Exercise[] = [
  // ========================================
  // Alphabet
  // ========================================

  {
    title: 'Letter → Position',
    route: 'letter-to-position',
    mode: PracticeMode.LetterToPosition,
    topic: 'alphabet',
    implemented: true,

    referenceColumns: [
      { header: 'Letter', key: 'letter' },
      { header: 'Position', key: 'position' },
    ],

    settings: [SettingType.SessionType],
  },
  {
    title: 'Position → Letter',
    route: 'position-to-letter',
    mode: PracticeMode.PositionToLetter,
    topic: 'alphabet',
    implemented: true,

    referenceColumns: [
      { header: 'Position', key: 'position' },
      { header: 'Letter', key: 'letter' },
    ],

    settings: [SettingType.SessionType],
  },
  {
    title: 'Letter → Reverse Position',
    route: 'letter-to-reversePosition',
    mode: PracticeMode.LetterToReversePosition,
    topic: 'alphabet',
    implemented: true,

    referenceColumns: [
      { header: 'Letter', key: 'letter' },
      { header: 'Reverse Position', key: 'reversePosition' },
    ],

    settings: [SettingType.SessionType],
  },
  {
    title: 'Reverse Position → Letter',
    route: 'reversePosition-to-letter',
    mode: PracticeMode.ReversePositionToLetter,
    topic: 'alphabet',
    implemented: true,

    referenceColumns: [
      { header: 'Reverse Position', key: 'reversePosition' },
      { header: 'Letter', key: 'letter' },
    ],

    settings: [SettingType.SessionType],
  },
  {
    title: 'Mirror Letter',
    route: 'mirror-letter',
    mode: PracticeMode.MirrorLetter,
    topic: 'alphabet',
    implemented: true,

    referenceColumns: [
      { header: 'Letter', key: 'letter' },
      { header: 'Mirror Letter', key: 'mirrorLetter' },
    ],

    referenceExpandable: true,

    referenceExpandedColumns: [{ header: 'Mnemonic', key: 'mnemonic' }],

    settings: [SettingType.SessionType],
  },

  // ========================================
  // Arithmetic
  // ========================================

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

  // ========================================
  // Tables
  // ========================================

  {
    title: 'Tables',
    route: 'tables',
    mode: PracticeMode.Tables,
    topic: 'tables',
    implemented: true,

    referenceColumns: [
      { header: 'Expression', key: 'expression' },
      { header: 'Result', key: 'result' },
    ],

    settings: [
      SettingType.SessionType,
      SettingType.TableSelection,
      SettingType.MultiplierLimit,
    ],
  },

  // ========================================
  // Powers
  // ========================================

  {
    title: 'Squares',
    route: 'squares',
    mode: PracticeMode.Squares,
    topic: 'powers',
    implemented: true,

    referenceColumns: [
      { header: 'Number', key: 'number' },
      { header: 'Square', key: 'square' },
    ],

    settings: [SettingType.SessionType, SettingType.NumberRange],
  },
  {
    title: 'Cubes',
    route: 'cubes',
    mode: PracticeMode.Cubes,
    topic: 'powers',
    implemented: true,

    referenceColumns: [
      { header: 'Number', key: 'number' },
      { header: 'Cube', key: 'cube' },
    ],

    settings: [SettingType.SessionType, SettingType.NumberRange],
  },
  {
    title: 'Square Roots',
    route: 'square-roots',
    mode: PracticeMode.SquareRoots,
    topic: 'powers',
    implemented: true,

    referenceColumns: [
      { header: 'Number', key: 'number' },
      { header: 'Square Root', key: 'squareRoot' },
    ],

    settings: [SettingType.SessionType, SettingType.NumberRange],
  },
  {
    title: 'Cube Roots',
    route: 'cube-roots',
    mode: PracticeMode.CubeRoots,
    topic: 'powers',
    implemented: true,

    referenceColumns: [
      { header: 'Number', key: 'number' },
      { header: 'Cube Root', key: 'cubeRoot' },
    ],

    settings: [SettingType.SessionType, SettingType.NumberRange],
  },

  // ========================================
  // Conversions
  // ========================================

  {
    title: 'Fraction → Decimal',
    route: 'fraction-to-decimal',
    mode: PracticeMode.FractionToDecimal,
    topic: 'conversions',
    implemented: true,

    referenceColumns: [
      { header: 'Fraction', key: 'fraction' },
      { header: 'Decimal', key: 'decimal' },
    ],

    settings: [SettingType.SessionType, SettingType.Denominator],
  },
  {
    title: 'Decimal → Fraction',
    route: 'decimal-to-fraction',
    mode: PracticeMode.DecimalToFraction,
    topic: 'conversions',
    implemented: true,

    referenceColumns: [
      { header: 'Decimal', key: 'decimal' },
      { header: 'Fraction', key: 'fraction' },
    ],

    settings: [SettingType.SessionType, SettingType.Denominator],
  },
  {
    title: 'Fraction → Percentage',
    route: 'fraction-to-percentage',
    mode: PracticeMode.FractionToPercentage,
    topic: 'conversions',
    implemented: true,

    referenceColumns: [
      { header: 'Fraction', key: 'fraction' },
      { header: 'Percentage', key: 'percentage' },
    ],

    settings: [SettingType.SessionType, SettingType.Denominator],
  },
  {
    title: 'Percentage → Fraction',
    route: 'percentage-to-fraction',
    mode: PracticeMode.PercentageToFraction,
    topic: 'conversions',
    implemented: true,

    referenceColumns: [
      { header: 'Percentage', key: 'percentage' },
      { header: 'Fraction', key: 'fraction' },
    ],

    settings: [SettingType.SessionType, SettingType.Denominator],
  },
  {
    title: 'Decimal → Percentage',
    route: 'decimal-to-percentage',
    mode: PracticeMode.DecimalToPercentage,
    topic: 'conversions',
    implemented: true,

    referenceColumns: [
      { header: 'Decimal', key: 'decimal' },
      { header: 'Percentage', key: 'percentage' },
    ],

    settings: [SettingType.SessionType],
  },
  {
    title: 'Percentage → Decimal',
    route: 'percentage-to-decimal',
    mode: PracticeMode.PercentageToDecimal,
    topic: 'conversions',
    implemented: true,

    referenceColumns: [
      { header: 'Percentage', key: 'percentage' },
      { header: 'Decimal', key: 'decimal' },
    ],

    settings: [SettingType.SessionType],
  },

  // ========================================
  // Notes
  // ========================================

  {
    title: 'Number System',
    route: 'number-system',
    mode: PracticeMode.NumberSystem,
    topic: 'notes',
    implemented: true,

    settings: [],
  },

  // ========================================
  // Polity
  // ========================================

  {
    title: 'Article → Title',
    route: 'article-to-title',
    mode: PracticeMode.ArticleToTitle,
    topic: 'polity',
    implemented: true,

    referenceColumns: [
      { header: 'Article', key: 'article' },
      { header: 'Title', key: 'title' },
    ],

    settings: [SettingType.SessionType],
  },
  {
    title: 'Title → Article',
    route: 'title-to-article',
    mode: PracticeMode.TitleToArticle,
    topic: 'polity',
    implemented: true,

    referenceColumns: [
      { header: 'Title', key: 'title' },
      { header: 'Article', key: 'article' },
    ],

    settings: [SettingType.SessionType],
  },

  // ========================================
  // Vocabulary
  // ========================================

  {
    title: 'Synonyms',
    route: 'synonyms',
    mode: PracticeMode.Synonyms,
    topic: 'vocabulary',
    implemented: true,

    referenceColumns: [
      { header: 'Word', key: 'word' },
      { header: 'Synonyms', key: 'synonyms' },
    ],

    referenceExpandable: true,

    referenceExpandedColumns: [
      { header: 'Part of Speech', key: 'partsOfSpeech' },
      { header: 'Meaning', key: 'meaning' },
      { header: 'Example', key: 'example' },
    ],

    settings: [SettingType.SessionType, SettingType.WordsLimit],
  },
  {
    title: 'Antonyms',
    route: 'antonyms',
    mode: PracticeMode.Antonyms,
    topic: 'vocabulary',
    implemented: true,

    referenceColumns: [
      { header: 'Word', key: 'word' },
      { header: 'Antonyms', key: 'antonyms' },
    ],

    referenceExpandable: true,

    referenceExpandedColumns: [
      { header: 'Part of Speech', key: 'partsOfSpeech' },
      { header: 'Meaning', key: 'meaning' },
      { header: 'Example', key: 'example' },
    ],

    settings: [SettingType.SessionType, SettingType.WordsLimit],
  },
  {
    title: 'One Word Substitutions',
    route: 'one-word-substitutions',
    mode: PracticeMode.OneWord,
    topic: 'vocabulary',
    implemented: true,

    referenceColumns: [
      { header: 'Phrase', key: 'phrase' },
      { header: 'One Word Substitution', key: 'word' },
    ],

    referenceExpandable: true,

    referenceExpandedColumns: [
      { header: 'Part of Speech', key: 'partsOfSpeech' },
      { header: 'Meaning', key: 'meaning' },
      { header: 'Example', key: 'example' },
    ],

    settings: [SettingType.SessionType, SettingType.WordsLimit],
  },
  {
    title: 'Idioms',
    route: 'idioms',
    mode: PracticeMode.Idioms,
    topic: 'vocabulary',
    implemented: true,

    referenceColumns: [
      { header: 'Idiom', key: 'idiom' },
      { header: 'Meaning', key: 'meaning' },
    ],

    referenceExpandable: true,

    referenceExpandedColumns: [
      { header: 'Example', key: 'example' },
      { header: 'Origin', key: 'origin' },
    ],

    settings: [SettingType.SessionType, SettingType.WordsLimit],
  },
  {
    title: 'Phrasal Verbs',
    route: 'phrasal-verbs',
    mode: PracticeMode.PhrasalVerbs,
    topic: 'vocabulary',
    implemented: true,

    referenceColumns: [
      { header: 'Phrasal Verb', key: 'phrase' },
      { header: 'Meaning', key: 'meaning' },
    ],

    referenceExpandable: true,

    referenceExpandedColumns: [{ header: 'Example', key: 'example' }],

    settings: [SettingType.SessionType, SettingType.WordsLimit],
  },
  {
    title: 'Meanings',
    route: 'meanings',
    mode: PracticeMode.Meanings,
    topic: 'vocabulary',
    implemented: true,

    referenceColumns: [
      { header: 'Word', key: 'word' },
      { header: 'Meaning', key: 'meaning' },
    ],

    referenceExpandable: true,

    referenceExpandedColumns: [
      { header: 'Part of Speech', key: 'partsOfSpeech' },
      { header: 'Example', key: 'example' },
    ],

    settings: [SettingType.SessionType, SettingType.WordsLimit],
  },
  {
    title: 'Fixed Prepositions',
    route: 'fixed-prepositions',
    mode: PracticeMode.FixedPrepositions,
    topic: 'vocabulary',
    implemented: true,

    referenceColumns: [
      { header: 'Word', key: 'word' },
      { header: 'Preposition', key: 'preposition' },
    ],

    referenceExpandable: true,

    referenceExpandedColumns: [
      { header: 'Expression', key: 'expression' },
      { header: 'Meaning', key: 'meaning' },
      { header: 'Example', key: 'example' },
    ],

    settings: [SettingType.SessionType, SettingType.WordsLimit],
  },
];
