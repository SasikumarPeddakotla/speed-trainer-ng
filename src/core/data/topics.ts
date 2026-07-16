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
    title: 'Arithmetic',
    route: 'arithmetic',
    subject: 'aptitude',
    implemented: false,
  },
  {
    title: 'Powers',
    route: 'powers',
    subject: 'aptitude',
    implemented: false,
  },

  // Awareness

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
];
