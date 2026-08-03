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
import { SettingsService } from '../services/settings.service';
import { PracticeMode } from '../enums/practice-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class VocabularyEngine {
  private randomService = inject(RandomService);

  private synonyms: Synonym[] = [];
  private antonyms: Antonym[] = [];
  private oneWords: OneWord[] = [];
  private idioms: Idiom[] = [];

  constructor(
    private reviewService: ReviewService,
    private settingsService: SettingsService,
  ) {}

  generateSynonymQuestion(): Question<Synonym> {
    return this.createSynonymQuestion(this.nextSynonym());
  }

  createSynonymQuestion(synonym: Synonym): Question<Synonym> {
    const pair = this.getRandomWordPair(synonym.word, synonym.synonyms);

    return {
      id: `synonym:${synonym.word}`,
      question: pair.question,

      answer: pair.answer,

      acceptedAnswers: pair.acceptedAnswers,

      options: this.randomService.buildOptions(
        synonym,
        SYNONYMS,
        (s) => [s.word, ...s.synonyms],
        (s) => s.word,
        pair.answer,
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

      this.synonyms = this.randomService.shuffle([...this.getSynonyms()]);
    }

    return this.synonyms.shift()!;
  }

  generateAntonymQuestion(): Question<Antonym> {
    return this.createAntonymQuestion(this.nextAntonym());
  }

  createAntonymQuestion(antonym: Antonym): Question<Antonym> {
    const pair = this.getRandomWordPair(antonym.word, antonym.antonyms);

    return {
      id: `antonym:${antonym.word}`,
      question: pair.question,

      answer: pair.answer,

      acceptedAnswers: pair.acceptedAnswers,

      options: this.randomService.buildOptions(
        antonym,
        ANTONYMS,
        (a) => [a.word, ...a.antonyms],
        (a) => a.word,
        pair.answer,
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

      this.antonyms = this.randomService.shuffle([...this.getAntonyms()]);
    }

    return this.antonyms.shift()!;
  }

  generateOneWordQuestion(): Question<OneWord> {
    return this.createOneWordQuestion(this.nextOneWord());
  }

  createOneWordQuestion(oneWord: OneWord): Question<OneWord> {
    return {
      id: `one-word:${oneWord.word}`,
      question: oneWord.word,

      answer: oneWord.phrase,

      options: this.randomService.buildOptions(
        oneWord,
        ONE_WORDS,
        (o) => [o.phrase],
        (o) => o.word,
        oneWord.phrase,
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

      this.oneWords = this.randomService.shuffle([...this.getOneWords()]);
    }

    return this.oneWords.shift()!;
  }

  generateIdiomQuestion(): Question<Idiom> {
    return this.createIdiomQuestion(this.nextIdiom());
  }

  createIdiomQuestion(idiom: Idiom): Question<Idiom> {
    return {
      id: `idiom:${idiom.idiom}`,
      question: idiom.idiom,

      answer: idiom.meaning,

      options: this.randomService.buildOptions(
        idiom,
        IDIOMS,
        (i) => [i.meaning],
        (i) => i.idiom,
        idiom.meaning,
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

      this.idioms = this.randomService.shuffle([...this.getIdioms()]);
    }

    return this.idioms.shift()!;
  }

  private getWordLimit(): number {
    return Number(this.settingsService.settings().wordsLimit);
  }

  private getSynonyms(): Synonym[] {
    return SYNONYMS.slice(0, this.getWordLimit());
  }

  private getAntonyms(): Antonym[] {
    return ANTONYMS.slice(0, this.getWordLimit());
  }

  private getOneWords(): OneWord[] {
    return ONE_WORDS.slice(0, this.getWordLimit());
  }

  private getIdioms(): Idiom[] {
    return IDIOMS.slice(0, this.getWordLimit());
  }

  getSynonymsReference(): Synonym[] {
    return this.getSynonyms();
  }

  getAntonymsReference(): Antonym[] {
    return this.getAntonyms();
  }

  getOneWordsReference(): OneWord[] {
    return this.getOneWords();
  }

  getIdiomsReference(): Idiom[] {
    return this.getIdioms();
  }

  getVocabularyCount(): number {
    switch (this.settingsService.settings().selectedExercise?.mode) {
      case PracticeMode.Synonyms:
        return SYNONYMS.length;

      case PracticeMode.Antonyms:
        return ANTONYMS.length;

      case PracticeMode.OneWord:
        return ONE_WORDS.length;

      case PracticeMode.Idioms:
        return IDIOMS.length;

      default:
        return 0;
    }
  }

  private getRandomWordPair(word: string, relatedWords: string[]) {
    // Uncomment the below line to get a random word from word and synonyms array as question and answer
    // const group = this.randomService.shuffle([word, ...relatedWords]);
    const group = [word, ...relatedWords];

    return {
      question: group[0],
      answer: group[1],
      acceptedAnswers: group.slice(1),
    };
  }
}
