import { Topic } from '../models/topic.model';

export const topics: Topic[] = [
  // Reasoning

  {
    title: 'Alphabet',
    route: 'alphabet',
    subject: 'reasoning',
    implemented: true,
  },
  {
    title: 'Coding-Decoding',
    route: 'coding-decoding',
    subject: 'reasoning',
    implemented: false,
  },
  {
    title: 'Analogy',
    route: 'analogy',
    subject: 'reasoning',
    implemented: false,
  },
  {
    title: 'Series',
    route: 'series',
    subject: 'reasoning',
    implemented: false,
  },

  // Aptitude

  {
    title: 'Addition',
    route: 'addition',
    subject: 'aptitude',
    implemented: false,
  },
  {
    title: 'Subtraction',
    route: 'subtraction',
    subject: 'aptitude',
    implemented: false,
  },
  {
    title: 'Multiplication',
    route: 'multiplication',
    subject: 'aptitude',
    implemented: false,
  },
  {
    title: 'Division',
    route: 'division',
    subject: 'aptitude',
    implemented: false,
  },
  {
    title: 'Tables',
    route: 'tables',
    subject: 'aptitude',
    implemented: true,
  },
  {
    title: 'Squares',
    route: 'squares',
    subject: 'aptitude',
    implemented: false,
  },
  {
    title: 'Cubes',
    route: 'cubes',
    subject: 'aptitude',
    implemented: false,
  },
  {
    title: 'Square Roots',
    route: 'square-roots',
    subject: 'aptitude',
    implemented: false,
  },
  {
    title: 'Cube Roots',
    route: 'cube-roots',
    subject: 'aptitude',
    implemented: false,
  },

  // General Awareness

  {
    title: 'Polity',
    route: 'polity',
    subject: 'awareness',
    implemented: false,
  },
  {
    title: 'History',
    route: 'history',
    subject: 'awareness',
    implemented: false,
  },

  // English

  {
    title: 'Articles',
    route: 'articles',
    subject: 'english',
    implemented: false,
  },
];
