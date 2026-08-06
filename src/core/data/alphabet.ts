import { Alphabet } from '../models/alphabet.model';

const mirrorMnemonics: Record<string, string> = {
  A: 'A to Z',
  B: 'BYe',
  C: 'Chennai Express',
  D: 'Deep Water',
  E: 'EVening',
  F: 'Follow Up',
  G: 'Gujarat Titans',
  H: 'High School',
  I: 'InfraRed',
  J: 'Jack & Queen',
  K: 'King Pin',
  L: 'LOgin',
  M: 'MaN',
  N: 'NightMare',
  O: 'OLd',
  P: 'Pawan Kalyan',
  Q: 'Queen Jet',
  R: 'Red Ink',
  S: 'Sky High',
  T: 'Thank God',
  U: 'UFO',
  V: 'VIP Entry',
  W: 'Wild Dog',
  X: 'X-ray Cat',
  Y: 'Yellow Bird',
  Z: 'Z to A',
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
