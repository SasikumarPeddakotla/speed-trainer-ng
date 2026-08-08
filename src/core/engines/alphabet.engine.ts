import { inject, Injectable } from '@angular/core';

import { Question } from '../models/question.model';

import { alphabetData } from '../data/alphabet';
import { Alphabet } from '../models/alphabet.model';
import { SettingsService } from '../services/settings.service';
import { Direction } from '../enums/direction.enum';
import { PracticeMode } from '../enums/practice-mode.enum';
import { RandomService } from '../../utils/random.service';
import { ReviewService } from '../services/review.service';
import { IdService } from '../../utils/id.service';

@Injectable({
  providedIn: 'root',
})
export class AlphabetEngine {
  private randomService = inject(RandomService);
  private alphabets = this.randomService.shuffle([...alphabetData]);

  constructor(
    private settingsService: SettingsService,
    private reviewService: ReviewService,
    private idService: IdService,
  ) {}

  generateQuestion() {
    const mode = this.settingsService.settings().selectedExercise?.mode;
    const direction = this.settingsService.settings().direction;

    switch (mode) {
      case PracticeMode.LetterPosition:
        return direction === Direction.Forward
          ? this.letterToPosition()
          : this.positionToLetter();

      case PracticeMode.LetterReversePosition:
        return direction === Direction.Forward
          ? this.letterToReversePosition()
          : this.reversePositionToLetter();

      default:
        return null;
    }
  }

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

  getAlphabetReference(): Alphabet[] {
    return alphabetData;
  }

  reset() {
    this.alphabets = [];
  }
}
