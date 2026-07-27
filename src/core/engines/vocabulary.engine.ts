import { inject, Injectable } from '@angular/core';

import { SYNONYMS } from '../data/synonyms.data';
import { ANTONYMS } from '../data/antonyms.data';
import { ONE_WORDS } from '../data/one-words.data';
import { IDIOMS } from '../data/idioms.data';
import { Question } from '../models/question.model';
import { Synonym } from '../models/synonym.model';
import { RandomService } from '../../utils/random.service';
import { InputType } from '../enums/input-type.enum';
import { Antonym } from '../models/antonym.model';
import { OneWord } from '../models/one-word.model';
import { Idiom } from '../models/idiom.model';
import { ReviewService } from '../services/review.service';

@Injectable({
  providedIn: 'root',
})
export class VocabularyEngine {
  private randomService = inject(RandomService);

  private synonyms = this.randomService.shuffle([...SYNONYMS]);
  private antonyms = this.randomService.shuffle([...ANTONYMS]);
  private oneWords = this.randomService.shuffle([...ONE_WORDS]);
  private idioms = this.randomService.shuffle([...IDIOMS]);

  constructor(private reviewService: ReviewService) {}

  generateSynonymQuestion(): Question<Synonym> {
    const synonym = this.nextSynonym();

    return {
      question: synonym.word,

      answer: synonym.synonyms[0],

      acceptedAnswers: synonym.synonyms,

      options: this.randomService.buildOptions(
        synonym,
        SYNONYMS,
        (s) => s.synonyms[0],
        (s) => s.word,
      ),

      data: synonym,

      inputType: InputType.MultipleChoice,

      displayType: 'text',

      explanation: `${synonym.word}(${synonym.partsOfSpeech}) - ${synonym.meaning}`,
    };
  }

  private nextSynonym(): Synonym {
    let review = this.reviewService.getNextReviewQuestion<Synonym>();

    if (review) {
      return review;
    }

    if (this.synonyms.length === 0) {
      let review = this.reviewService.getNextReviewQuestion<Synonym>();

      if (review) {
        return review;
      }

      this.synonyms = this.randomService.shuffle([...SYNONYMS]);
    }

    return this.synonyms.shift()!;
  }

  generateAntonymQuestion(): Question<Antonym> {
    const antonym = this.nextAntonym();

    return {
      question: antonym.word,

      answer: antonym.antonyms[0],

      acceptedAnswers: antonym.antonyms,

      options: this.randomService.buildOptions(
        antonym,
        ANTONYMS,
        (a) => a.antonyms[0],
        (a) => a.word,
      ),

      data: antonym,

      inputType: InputType.MultipleChoice,

      displayType: 'text',

      explanation: `${antonym.word} - ${antonym.meaning}`,
    };
  }

  private nextAntonym(): Antonym {
    let review = this.reviewService.getNextReviewQuestion<Antonym>();

    if (review) {
      return review;
    }

    if (this.antonyms.length === 0) {
      let review = this.reviewService.getNextReviewQuestion<Antonym>();

      if (review) {
        return review;
      }

      this.antonyms = this.randomService.shuffle([...ANTONYMS]);
    }

    return this.antonyms.shift()!;
  }

  generateOneWordQuestion(): Question<OneWord> {
    const oneWord = this.nextOneWord();

    return {
      question: oneWord.word,

      answer: oneWord.phrase,

      options: this.randomService.buildOptions(
        oneWord,
        ONE_WORDS,
        (o) => o.phrase,
        (o) => o.word,
      ),

      data: oneWord,

      inputType: InputType.MultipleChoice,

      displayType: 'text',
    };
  }

  private nextOneWord(): OneWord {
    let review = this.reviewService.getNextReviewQuestion<OneWord>();

    if (review) {
      return review;
    }

    if (this.oneWords.length === 0) {
      let review = this.reviewService.getNextReviewQuestion<OneWord>();

      if (review) {
        return review;
      }

      this.oneWords = this.randomService.shuffle([...ONE_WORDS]);
    }

    return this.oneWords.shift()!;
  }

  generateIdiomQuestion(): Question<Idiom> {
    const idiom = this.nextIdiom();

    return {
      question: idiom.idiom,

      answer: idiom.meaning,

      options: this.randomService.buildOptions(
        idiom,
        IDIOMS,
        (o) => o.meaning,
        (o) => o.idiom,
      ),

      data: idiom,

      inputType: InputType.MultipleChoice,

      displayType: 'text',
    };
  }

  private nextIdiom(): Idiom {
    let review = this.reviewService.getNextReviewQuestion<Idiom>();

    if (review) {
      return review;
    }

    if (this.idioms.length === 0) {
      let review = this.reviewService.getNextReviewQuestion<Idiom>();

      if (review) {
        return review;
      }

      this.idioms = this.randomService.shuffle([...IDIOMS]);
    }

    return this.idioms.shift()!;
  }
}
