import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class AlphabetEngine {
  private readonly letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  letterToPosition(): Question {
    const index = Math.floor(Math.random() * this.letters.length);

    return {
      question: this.letters[index],
      answer: String(index + 1),
      inputType: 'number',
      displayType: 'symbol',
    };
  }
}
