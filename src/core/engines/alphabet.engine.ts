import { Injectable } from '@angular/core';

import { Question } from '../models/question.model';
import { LearningQueue } from '../../utils/learning-queue';

import { alphabetData } from '../data/alphabet';
import { Alphabet } from '../models/alphabet.model';

@Injectable({
  providedIn: 'root',
})
export class AlphabetEngine {
  private readonly queue = new LearningQueue(alphabetData);

  letterToPosition(): Question {
    const alphabet = this.queue.next();

    return {
      question: alphabet.letter,
      answer: String(alphabet.position),
      data: alphabet,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  scheduleReview(item: Alphabet) {
    this.queue.scheduleReview(item);
  }

  reset() {
    this.queue.reset();
  }
}
