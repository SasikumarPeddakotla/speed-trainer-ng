import { inject, Injectable } from '@angular/core';

import { Question } from '../models/question.model';
import { Synonym } from '../models/synonym.model';
import { RandomService } from '../../utils/random.service';
import { InputType } from '../enums/input-type.enum';
import { Antonym } from '../models/antonym.model';
import { OneWord } from '../models/one-word.model';
import { Idiom } from '../models/idiom.model';
import { StateService } from '../services/state.service';
import { PracticeMode } from '../enums/practice-mode.enum';
import { ExampleFormatterService } from '../../utils/example-formatter.service';
import { DataService } from '../services/data.service';
import { IdService } from '../../utils/id.service';
import { BookmarkService } from '../services/bookmark.service';
import { PhrasalVerb } from '../models/phrasal-verb.model';

@Injectable({
  providedIn: 'root',
})
export class VocabularyEngine {
  private randomService = inject(RandomService);

  private synonyms: Synonym[] = [];
  private antonyms: Antonym[] = [];
  private oneWords: OneWord[] = [];
  private idioms: Idiom[] = [];
  private phrasalVerbs: PhrasalVerb[] = [];

  constructor(
    private stateService: StateService,
    private formatterService: ExampleFormatterService,
    private dataService: DataService,
    private idService: IdService,
    private bookmarkService: BookmarkService,
  ) {}

  generateSynonymQuestion(): Question<Synonym> {
    return this.createSynonymQuestion(this.nextSynonym());
  }

  createSynonymQuestion(synonym: Synonym): Question<Synonym> {
    const pair = this.getRandomWordPair(synonym.word, synonym.synonyms);

    const filteredSynonyms = this.dataService
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

      inputType: InputType.TextAndMultipleChoice,

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
      case 'bookmark':
        return this.nextBookmarkSynonym();
    }
  }

  private nextNormalSynonym(): Synonym {
    if (this.synonyms.length === 0) {
      this.synonyms = this.randomService.shuffle([...this.getSynonyms()]);
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

    const filteredAntonyms = this.dataService
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

      inputType: InputType.TextAndMultipleChoice,

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
      case 'bookmark':
        return this.nextBookmarkAntonym();
    }
  }

  private nextNormalAntonym(): Antonym {
    if (this.antonyms.length === 0) {
      this.antonyms = this.randomService.shuffle([...this.getAntonyms()]);
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
    const filteredOneWords = this.dataService
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

      inputType: InputType.TextAndMultipleChoice,

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
      case 'bookmark':
        return this.nextBookmarkOneWord();
    }
  }

  private nextNormalOneWord(): OneWord {
    if (this.oneWords.length === 0) {
      this.oneWords = this.randomService.shuffle([...this.getOneWords()]);
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
        this.dataService.getIdioms(),
        (i) => [i.option],
        (i) => i.idiom,
        idiom.option,
      ),

      data: idiom,

      inputType: InputType.TextAndMultipleChoice,

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
      case 'bookmark':
        return this.nextBookmarkIdiom();
    }
  }

  private nextNormalIdiom(): Idiom {
    if (this.idioms.length === 0) {
      this.idioms = this.randomService.shuffle([...this.getIdioms()]);
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

  generatePhrasalVerbQuestion(): Question<PhrasalVerb> {
    return this.createPhrasalVerbQuestion(this.nextPhrasalVerb());
  }

  createPhrasalVerbQuestion(phrasalVerb: PhrasalVerb): Question<PhrasalVerb> {
    const randomIndex = this.randomService.random(
      0,
      phrasalVerb.meaning.length - 1,
    );

    return {
      id: this.idService.getQuestionId(phrasalVerb.phrase),
      question: phrasalVerb.phrase,

      answer: phrasalVerb.meaning[randomIndex],

      acceptedAnswers: phrasalVerb.meaning,

      options: this.randomService.buildOptions(
        phrasalVerb,
        this.dataService.getPhrasalVerbs(),
        (s) => [...s.meaning],
        (s) => s.phrase,
        phrasalVerb.meaning[randomIndex],
      ),

      data: phrasalVerb,

      inputType: InputType.TextAndMultipleChoice,

      displayType: 'text',

      explanation: this.formatPhrasalVerbExplanation(phrasalVerb),
    };
  }

  private formatPhrasalVerbExplanation(phrasalVerb: PhrasalVerb): string {
    const meaningsAndExamples = phrasalVerb.meaning
      .map(
        (meaning, index) => `
        <strong>Meaning:- </strong>${meaning}<br>
        <strong>Ex:- </strong>${this.formatterService.formatExample(
          phrasalVerb.phrase,
          phrasalVerb.example[index],
        )}<br>
      `,
      )
      .join('<br>');

    return `
    <strong>${phrasalVerb.phrase}</strong><br><br>
    ${meaningsAndExamples}
  `;
  }

  private nextPhrasalVerb(): PhrasalVerb {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalPhrasalVerb();
      case 'bookmark':
        return this.nextBookmarkPhrasalVerb();
    }
  }

  private nextNormalPhrasalVerb(): PhrasalVerb {
    if (this.phrasalVerbs.length === 0) {
      this.phrasalVerbs = this.randomService.shuffle([
        ...this.getPhrasalVerbs(),
      ]);
    }

    return this.phrasalVerbs.shift()!;
  }

  private nextBookmarkPhrasalVerb(): PhrasalVerb {
    if (this.phrasalVerbs.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<PhrasalVerb>();
      this.phrasalVerbs = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.phrasalVerbs.shift()!;
  }

  private getWordLimit(): number {
    return Number(this.stateService.practice().wordsLimit);
  }

  private getSynonyms(): Synonym[] {
    return this.dataService.getSynonyms().slice(0, this.getWordLimit());
  }

  private getAntonyms(): Antonym[] {
    return this.dataService.getAntonyms().slice(0, this.getWordLimit());
  }

  private getOneWords(): OneWord[] {
    return this.dataService.getOneWords().slice(0, this.getWordLimit());
  }

  private getIdioms(): Idiom[] {
    return this.dataService.getIdioms().slice(0, this.getWordLimit());
  }

  private getPhrasalVerbs(): PhrasalVerb[] {
    return this.dataService.getPhrasalVerbs().slice(0, this.getWordLimit());
  }

  getSynonymsReference(): Synonym[] {
    return this.dataService.getSynonyms();
  }

  getAntonymsReference(): Antonym[] {
    return this.dataService.getAntonyms();
  }

  getOneWordsReference(): OneWord[] {
    return this.dataService.getOneWords();
  }

  getIdiomsReference(): Idiom[] {
    return this.dataService.getIdioms();
  }

  getPhrasalVerbsReference(): PhrasalVerb[] {
    return this.dataService.getPhrasalVerbs();
  }

  getVocabularyCount(): number {
    switch (this.stateService.navigation().selectedExercise?.mode) {
      case PracticeMode.Synonyms:
        return this.dataService.getSynonyms().length;

      case PracticeMode.Antonyms:
        return this.dataService.getAntonyms().length;

      case PracticeMode.OneWord:
        return this.dataService.getOneWords().length;

      case PracticeMode.Idioms:
        return this.dataService.getIdioms().length;

      case PracticeMode.PhrasalVerbs:
        return this.dataService.getPhrasalVerbs().length;

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
