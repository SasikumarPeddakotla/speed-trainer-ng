import { inject, Injectable } from '@angular/core';

import { Question } from '../models/question.model';
import { Synonym } from '../models/synonym.model';
import { RandomService } from '../../utils/random.service';
import { InputType } from '../enums/input-type.enum';
import { Antonym } from '../models/antonym.model';
import { OneWord } from '../models/one-word.model';
import { Idiom } from '../models/idiom.model';
import { ReviewService } from '../services/review.service';
import { StateService } from '../services/state.service';
import { PracticeMode } from '../enums/practice-mode.enum';
import { ExampleFormatterService } from '../../utils/example-formatter.service';
import { VocabularyDataService } from '../services/vocabulary-data.service';
import { IdService } from '../../utils/id.service';
import { BookmarkService } from '../services/bookmark.service';

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
    private stateService: StateService,
    private formatterService: ExampleFormatterService,
    private vocabularyDataService: VocabularyDataService,
    private idService: IdService,
    private bookmarkService: BookmarkService,
  ) {}

  generateSynonymQuestion(): Question<Synonym> {
    return this.createSynonymQuestion(this.nextSynonym());
  }

  createSynonymQuestion(synonym: Synonym): Question<Synonym> {
    const pair = this.getRandomWordPair(synonym.word, synonym.synonyms);

    const filteredSynonyms = this.vocabularyDataService
      .getSynonyms()
      .filter((s) => s.partsOfSpeech === synonym.partsOfSpeech);

    return {
      id: this.idService.getQuestionId(synonym.word),
      question: pair.question,

      answer: pair.answer,

      acceptedAnswers: pair.acceptedAnswers,

      options: this.randomService.buildOptions(
        synonym,
        filteredSynonyms,
        (s) => [s.word, ...s.synonyms],
        (s) => s.word,
        pair.answer,
      ),

      data: synonym,

      inputType: InputType.MultipleChoice,

      displayType: 'text',

      explanation: this.formatSynonymExplanation(synonym),
    };
  }

  private formatSynonymExplanation(synonym: Synonym): string {
    const formattedExample = this.formatterService.formatExample(
      synonym.word,
      synonym.example,
    );
    return `
    <strong>${synonym.word}</strong> (${synonym.partsOfSpeech})<br>
    ${synonym.meaning}<br><br>

    <strong>Synonym${synonym.synonyms.length > 1 ? 's' : ''}:- </strong>
    ${synonym.synonyms.join(', ')}<br><br>

    <strong>Ex:- </strong>
    ${formattedExample}
  `;
  }

  private nextSynonym(): Synonym {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalSynonym();
      case 'weak':
        return this.nextWeakSynonym();
      case 'bookmark':
        return this.nextBookmarkSynonym();
    }
  }

  private nextNormalSynonym(): Synonym {
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

  private nextWeakSynonym(): Synonym {
    if (this.synonyms.length === 0) {
      const mode = this.stateService.navigation().selectedExercise!.mode;
      const reviewQuestions =
        this.reviewService.getPendingQuestions<Synonym>(mode);
      this.synonyms = this.randomService.shuffle(reviewQuestions);
    }

    return this.synonyms.shift()!;
  }

  private nextBookmarkSynonym(): Synonym {
    if (this.synonyms.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<Synonym>();
      this.synonyms = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.synonyms.shift()!;
  }

  generateAntonymQuestion(): Question<Antonym> {
    return this.createAntonymQuestion(this.nextAntonym());
  }

  createAntonymQuestion(antonym: Antonym): Question<Antonym> {
    const pair = this.getRandomWordPair(antonym.word, antonym.antonyms);

    const filteredAntonyms = this.vocabularyDataService
      .getAntonyms()
      .filter((a) => a.partsOfSpeech === antonym.partsOfSpeech);

    return {
      id: this.idService.getQuestionId(antonym.word),
      question: pair.question,

      answer: pair.answer,

      acceptedAnswers: pair.acceptedAnswers,

      options: this.randomService.buildOptions(
        antonym,
        filteredAntonyms,
        (a) => [a.word, ...a.antonyms],
        (a) => a.word,
        pair.answer,
      ),

      data: antonym,

      inputType: InputType.MultipleChoice,

      displayType: 'text',

      explanation: this.formatAntonymExplanation(antonym),
    };
  }

  private formatAntonymExplanation(antonym: Antonym): string {
    const formattedExample = this.formatterService.formatExample(
      antonym.word,
      antonym.example,
    );
    return `
    <strong>${antonym.word}</strong> (${antonym.partsOfSpeech})<br>
    ${antonym.meaning}<br><br>

    <strong>Antonym${antonym.antonyms.length > 1 ? 's' : ''}:- </strong>
    ${antonym.antonyms.join(', ')}<br><br>

    <strong>Ex:- </strong>
    ${formattedExample}
  `;
  }

  private nextAntonym(): Antonym {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalAntonym();
      case 'weak':
        return this.nextWeakAntonym();
      case 'bookmark':
        return this.nextBookmarkAntonym();
    }
  }

  private nextNormalAntonym(): Antonym {
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

  private nextWeakAntonym(): Antonym {
    if (this.antonyms.length === 0) {
      const mode = this.stateService.navigation().selectedExercise!.mode;
      const reviewQuestions =
        this.reviewService.getPendingQuestions<Antonym>(mode);
      this.antonyms = this.randomService.shuffle(reviewQuestions);
    }

    return this.antonyms.shift()!;
  }

  private nextBookmarkAntonym(): Antonym {
    if (this.antonyms.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<Antonym>();
      this.antonyms = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.antonyms.shift()!;
  }

  generateOneWordQuestion(): Question<OneWord> {
    return this.createOneWordQuestion(this.nextOneWord());
  }

  createOneWordQuestion(oneWord: OneWord): Question<OneWord> {
    const filteredOneWords = this.vocabularyDataService
      .getOneWords()
      .filter((o) => o.partsOfSpeech === oneWord.partsOfSpeech);

    return {
      id: this.idService.getQuestionId(oneWord.phrase),
      question: oneWord.phrase,

      answer: oneWord.word,

      options: this.randomService.buildOptions(
        oneWord,
        filteredOneWords,
        (o) => [o.word],
        (o) => o.phrase,
        oneWord.word,
      ),

      data: oneWord,

      inputType: InputType.MultipleChoice,

      displayType: 'text',

      explanation: this.formatOneWordExplanation(oneWord),
    };
  }

  private formatOneWordExplanation(oneWord: OneWord): string {
    const formattedExample = this.formatterService.formatExample(
      oneWord.word,
      oneWord.example,
    );
    return `
    <strong>${oneWord.word}</strong> (${oneWord.partsOfSpeech})<br>
    ${oneWord.meaning}<br><br>

    <strong>Ex:- </strong>
    ${formattedExample}
  `;
  }

  private nextOneWord(): OneWord {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalOneWord();
      case 'weak':
        return this.nextWeakOneWord();
      case 'bookmark':
        return this.nextBookmarkOneWord();
    }
  }

  private nextNormalOneWord(): OneWord {
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

  private nextWeakOneWord(): OneWord {
    if (this.oneWords.length === 0) {
      const mode = this.stateService.navigation().selectedExercise!.mode;
      const reviewQuestions =
        this.reviewService.getPendingQuestions<OneWord>(mode);
      this.oneWords = this.randomService.shuffle(reviewQuestions);
    }

    return this.oneWords.shift()!;
  }

  private nextBookmarkOneWord(): OneWord {
    if (this.oneWords.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<OneWord>();
      this.oneWords = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.oneWords.shift()!;
  }

  generateIdiomQuestion(): Question<Idiom> {
    return this.createIdiomQuestion(this.nextIdiom());
  }

  createIdiomQuestion(idiom: Idiom): Question<Idiom> {
    return {
      id: this.idService.getQuestionId(idiom.idiom),
      question: idiom.idiom,

      answer: idiom.option,

      options: this.randomService.buildOptions(
        idiom,
        this.vocabularyDataService.getIdioms(),
        (i) => [i.option],
        (i) => i.idiom,
        idiom.option,
      ),

      data: idiom,

      inputType: InputType.MultipleChoice,

      displayType: 'text',

      explanation: this.formatIdiomExplanation(idiom),
    };
  }

  private formatIdiomExplanation(idiom: Idiom): string {
    const formattedExample = this.formatterService.formatExample(
      idiom.idiom,
      idiom.example,
    );
    return `
    <strong>${idiom.idiom}</strong><br>
    ${idiom.meaning}<br><br>

    <strong>Ex:- </strong>
    ${formattedExample}<br>

    <details class="origin-details">
      <summary><strong>💡 Why this idiom?</strong></summary>

      <p class="origin-text">
        ${idiom.origin}
      </p>
    </details>
  `;
  }

  private nextIdiom(): Idiom {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalIdiom();
      case 'weak':
        return this.nextWeakIdiom();
      case 'bookmark':
        return this.nextBookmarkIdiom();
    }
  }

  private nextNormalIdiom(): Idiom {
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

  private nextWeakIdiom(): Idiom {
    if (this.idioms.length === 0) {
      const mode = this.stateService.navigation().selectedExercise!.mode;
      const reviewQuestions =
        this.reviewService.getPendingQuestions<Idiom>(mode);
      this.idioms = this.randomService.shuffle(reviewQuestions);
    }

    return this.idioms.shift()!;
  }

  private nextBookmarkIdiom(): Idiom {
    if (this.idioms.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<Idiom>();
      this.idioms = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.idioms.shift()!;
  }

  private getWordLimit(): number {
    return Number(this.stateService.practice().wordsLimit);
  }

  private getSynonyms(): Synonym[] {
    return this.vocabularyDataService
      .getSynonyms()
      .slice(0, this.getWordLimit());
  }

  private getAntonyms(): Antonym[] {
    return this.vocabularyDataService
      .getAntonyms()
      .slice(0, this.getWordLimit());
  }

  private getOneWords(): OneWord[] {
    return this.vocabularyDataService
      .getOneWords()
      .slice(0, this.getWordLimit());
  }

  private getIdioms(): Idiom[] {
    return this.vocabularyDataService.getIdioms().slice(0, this.getWordLimit());
  }

  getSynonymsReference(): Synonym[] {
    return this.vocabularyDataService.getSynonyms();
  }

  getAntonymsReference(): Antonym[] {
    return this.vocabularyDataService.getAntonyms();
  }

  getOneWordsReference(): OneWord[] {
    return this.vocabularyDataService.getOneWords();
  }

  getIdiomsReference(): Idiom[] {
    return this.vocabularyDataService.getIdioms();
  }

  getVocabularyCount(): number {
    switch (this.stateService.navigation().selectedExercise?.mode) {
      case PracticeMode.Synonyms:
        return this.vocabularyDataService.getSynonyms().length;

      case PracticeMode.Antonyms:
        return this.vocabularyDataService.getAntonyms().length;

      case PracticeMode.OneWord:
        return this.vocabularyDataService.getOneWords().length;

      case PracticeMode.Idioms:
        return this.vocabularyDataService.getIdioms().length;

      default:
        return 0;
    }
  }

  private getRandomWordPair(word: string, relatedWords: string[]) {
    // Uncomment the below line to get a random word from word and synonyms array as question and answer
    const group = this.randomService.shuffle([word, ...relatedWords]);

    return {
      question: group[0],
      answer: group[1],
      acceptedAnswers: group.slice(1),
    };
  }

  reset() {
    this.synonyms = [];
    this.antonyms = [];
    this.oneWords = [];
    this.idioms = [];
  }
}
