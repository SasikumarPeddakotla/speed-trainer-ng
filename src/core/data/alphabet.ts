import { Alphabet } from '../models/alphabet.model';

const mirrorMnemonics: Record<string, string> = {
  A: 'Active Zone',
  B: 'Bala Yogi',
  C: 'Color Xerox',
  D: 'Digital World',
  E: 'English Vocabulary',
  F: 'Follow Up',
  G: 'Golden Temple',
  H: 'High School',
  I: 'InfraRed',
  J: 'Jack and Queen ',
  K: 'Kungfu Panda',
  L: 'Law & Order',
  M: 'Mobile Network',
  N: 'NightMare',
  O: 'Online Learning',
  P: 'Pawan Kalyan',
  Q: 'Queen Jet',
  R: 'Rural India',
  S: 'Study Hours',
  T: 'Thank God',
  U: 'User Friendly',
  V: 'Visual Effects',
  W: 'Weekend Drive',
  X: 'Xerox Center',
  Y: 'Yummy Breakfast',
  Z: 'Zero Attendance',
};

export const alphabetData: Alphabet[] = Array.from(
  { length: 26 },
  (_, index) => {
    const position = index + 1;
    const letter = String.fromCharCode(65 + index); // A-Z

    return {
      letter,
      position,
      reversePosition: 27 - position,
      mirrorLetter: String.fromCharCode(90 - index), // Z-A
      mnemonic: mirrorMnemonics[letter],
    };
  },
);
