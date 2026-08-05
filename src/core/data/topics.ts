import { Topic } from '../models/topic.model';

export const topics: Topic[] = [
  // Reasoning

  {
    title: 'Alphabet',
    route: 'alphabet',
    subject: 'reasoning',
    implemented: true,
  },

  // Aptitude

  {
    title: 'Arithmetic',
    route: 'arithmetic',
    subject: 'aptitude',
    implemented: true,
  },
  {
    title: 'Tables',
    route: 'tables',
    subject: 'aptitude',
    implemented: true,
  },
  {
    title: 'Powers',
    route: 'powers',
    subject: 'aptitude',
    implemented: true,
  },
  {
    title: 'Conversions',
    route: 'conversions',
    subject: 'aptitude',
    implemented: true,
  },

  // General Awareness

  {
    title: 'Polity',
    route: 'polity',
    subject: 'awareness',
    implemented: true,
  },

  // English
  {
    title: 'Vocabulary',
    route: 'vocabulary',
    subject: 'english',
    implemented: true,
  },

  // Bookmarks
  {
    title: 'Bookmarks',
    route: 'bookmarks',
    subject: '',
    implemented: true,
  },
];
