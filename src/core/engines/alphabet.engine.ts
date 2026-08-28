import { inject, Injectable } from '@angular/core';

import { Question } from '../models/question.model';

import { Alphabet } from '../models/alphabet.model';
import { RandomService } from '../../utils/random.service';
import { StateService } from '../services/state.service';
import { BookmarkService } from '../services/bookmark.service';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root',
})
export class AlphabetEngine {
  private randomService = inject(RandomService);
  private alphabets: Alphabet[] = [];

  constructor(
    private stateService: StateService,
    private bookmarkService: BookmarkService,
    private dataService: DataService,
  ) {}

  letterToPosition(): Question<Alphabet> {
    const alphabet = this.nextAlphabet();

    return this.createLetterToPosition(alphabet);
  }

  createLetterToPosition(alphabet: Alphabet): Question<Alphabet> {
    return {
      id: alphabet.id,
      question: alphabet.letter,
      answer: String(alphabet.position),
      data: alphabet,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  positionToLetter(): Question<Alphabet> {
    const alphabet = this.nextAlphabet();

    return this.createPositionToLetter(alphabet);
  }

  createPositionToLetter(alphabet: Alphabet): Question<Alphabet> {
    return {
      id: alphabet.id,
      question: String(alphabet.position),
      answer: alphabet.letter,
      data: alphabet,
      inputType: 'text',
      displayType: 'symbol',
    };
  }

  letterToReversePosition(): Question<Alphabet> {
    const alphabet = this.nextAlphabet();

    return this.createLetterToReversePosition(alphabet);
  }

  createLetterToReversePosition(alphabet: Alphabet): Question<Alphabet> {
    return {
      id: alphabet.id,
      question: alphabet.letter,
      answer: String(alphabet.reversePosition),
      data: alphabet,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  reversePositionToLetter(): Question<Alphabet> {
    const alphabet = this.nextAlphabet();

    return this.createReversePositionToLetter(alphabet);
  }

  createReversePositionToLetter(alphabet: Alphabet): Question<Alphabet> {
    return {
      id: alphabet.id,
      question: String(alphabet.reversePosition),
      answer: alphabet.letter,
      data: alphabet,
      inputType: 'text',
      displayType: 'symbol',
    };
  }

  mirrorLetter(): Question<Alphabet> {
    const alphabet = this.nextAlphabet();

    return this.createMirrorLetter(alphabet);
  }

  createMirrorLetter(alphabet: Alphabet): Question<Alphabet> {
    return {
      id: alphabet.id,
      question: alphabet.letter,
      answer: alphabet.mirrorLetter,
      data: alphabet,
      inputType: 'text',
      displayType: 'symbol',
    };
  }

  private nextAlphabet(): Alphabet {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalAlphabet();
      case 'bookmark':
        return this.nextBookmarkAlphabet();
    }
  }

  private nextNormalAlphabet(): Alphabet {
    if (this.alphabets.length === 0) {
      this.alphabets = this.randomService.shuffle([
        ...this.dataService.getAlphabets(),
      ]);
    }

    return this.alphabets.shift()!;
  }

  private nextBookmarkAlphabet(): Alphabet {
    if (this.alphabets.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<Alphabet>();
      this.alphabets = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.alphabets.shift()!;
  }

  getAlphabetReference(): Alphabet[] {
    return this.dataService.getAlphabets();
  }

  reset() {
    this.alphabets = [];
  }
}
