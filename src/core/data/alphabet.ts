import { Alphabet } from '../models/alphabet.model';

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
    };
  },
);
