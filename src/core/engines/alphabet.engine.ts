import { inject, Injectable } from '@angular/core';

import { Question } from '../models/question.model';

import { alphabetData } from '../data/alphabet';
import { Alphabet } from '../models/alphabet.model';
import { RandomService } from '../../utils/random.service';
import { ReviewService } from '../services/review.service';
import { IdService } from '../../utils/id.service';
import { StateService } from '../services/state.service';
import { BookmarkService } from '../services/bookmark.service';

@Injectable({
  providedIn: 'root',
})
export class AlphabetEngine {
  private randomService = inject(RandomService);
  private alphabets = this.randomService.shuffle([...alphabetData]);

  constructor(
    private reviewService: ReviewService,
    private idService: IdService,
    private stateService: StateService,
    private bookmarkService: BookmarkService,
  ) {}

  letterToPosition(): Question<Alphabet> {
    const alphabet = this.nextAlphabet();

    return this.createLetterToPosition(alphabet);
  }

  createLetterToPosition(alphabet: Alphabet): Question<Alphabet> {
    return {
      id: this.idService.getQuestionId(alphabet.letter),
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
      id: this.idService.getQuestionId(alphabet.position),
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
      id: this.idService.getQuestionId(alphabet.letter),
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
      id: this.idService.getQuestionId(alphabet.reversePosition),
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
      id: this.idService.getQuestionId(alphabet.letter),
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
      case 'weak':
        return this.nextWeakAlphabet();
      case 'bookmark':
        return this.nextBookmarkAlphabet();
    }
  }

  private nextNormalAlphabet(): Alphabet {
    let review = this.reviewService.getNextReviewQuestion<Alphabet>();

    if (review) {
      return review;
    }

    if (this.alphabets.length === 0) {
      review = this.reviewService.getNextReviewQuestion<Alphabet>();

      if (review) {
        return review;
      }

      this.alphabets = this.randomService.shuffle([...alphabetData]);
    }

    return this.alphabets.shift()!;
  }

  private nextWeakAlphabet(): Alphabet {
    if (this.alphabets.length === 0) {
      const mode = this.stateService.navigation().selectedExercise!.mode;
      const reviewQuestions =
        this.reviewService.getPendingQuestions<Alphabet>(mode);
      this.alphabets = this.randomService.shuffle(reviewQuestions);
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
    return alphabetData;
  }

  reset() {
    this.alphabets = [];
  }
}
