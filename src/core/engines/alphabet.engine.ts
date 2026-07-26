import { inject, Injectable } from '@angular/core';

import { Question } from '../models/question.model';

import { alphabetData } from '../data/alphabet';
import { Alphabet } from '../models/alphabet.model';
import { SettingsService } from '../services/settings.service';
import { Direction } from '../enums/direction.enum';
import { PracticeMode } from '../enums/practice-mode.enum';
import { RandomService } from '../../utils/random.service';
import { ReviewService } from '../services/review.service';

@Injectable({
  providedIn: 'root',
})
export class AlphabetEngine {
  private randomService = inject(RandomService);
  private alphabets = this.randomService.shuffle([...alphabetData]);

  constructor(
    private settingsService: SettingsService,
    private reviewService: ReviewService,
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

  private nextAlphabet(): Alphabet {
    const exerciseKey = this.getExerciseKey();
    let review =
      this.reviewService.getNextReviewQuestion<Alphabet>(exerciseKey);

    if (review) {
      return review;
    }

    if (this.alphabets.length === 0) {
      this.alphabets = this.randomService.shuffle([...alphabetData]);

      review = this.reviewService.getNextReviewQuestion<Alphabet>(exerciseKey);

      if (review) {
        return review;
      }
    }

    return this.alphabets.shift()!;
  }

  private getExerciseKey(): string {
    const settings = this.settingsService.settings();

    const mode = settings.selectedExercise!.mode;
    const direction = settings.direction;

    return direction ? `${mode}_${direction}` : mode;
  }
}
