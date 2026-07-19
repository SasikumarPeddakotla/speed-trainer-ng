import { Injectable } from '@angular/core';

import { Question } from '../models/question.model';

import { alphabetData } from '../data/alphabet';
import { Alphabet } from '../models/alphabet.model';

@Injectable({
  providedIn: 'root',
})
export class AlphabetEngine {
  private alphabets = this.shuffle([...alphabetData]);

  letterToPosition(): Question<Alphabet> {
    const alphabet = this.nextAlphabet();

    return {
      question: alphabet.letter,
      answer: String(alphabet.position),
      data: alphabet,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  positionToLetter(): Question<Alphabet> {
    const alphabet = this.nextAlphabet();

    return {
      question: String(alphabet.position),
      answer: alphabet.letter,
      data: alphabet,
      inputType: 'text',
      displayType: 'symbol',
    };
  }

  letterToReversePosition(): Question<Alphabet> {
    const alphabet = this.nextAlphabet();

    return {
      question: alphabet.letter,
      answer: String(alphabet.reversePosition),
      data: alphabet,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  reversePositionToLetter(): Question<Alphabet> {
    const alphabet = this.nextAlphabet();

    return {
      question: String(alphabet.reversePosition),
      answer: alphabet.letter,
      data: alphabet,
      inputType: 'text',
      displayType: 'symbol',
    };
  }

  mirrorLetter(): Question<Alphabet> {
    const alphabet = this.nextAlphabet();

    return {
      question: alphabet.letter,
      answer: alphabet.mirrorLetter,
      data: alphabet,
      inputType: 'text',
      displayType: 'symbol',
    };
  }

  private shuffle(items: Alphabet[]): Alphabet[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [items[i], items[j]] = [items[j], items[i]];
    }

    return items;
  }

  private nextAlphabet(): Alphabet {
    if (this.alphabets.length === 0) {
      this.alphabets = this.shuffle([...alphabetData]);
    }

    return this.alphabets.shift()!;
  }
}
