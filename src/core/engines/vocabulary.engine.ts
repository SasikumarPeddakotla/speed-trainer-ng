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
import { BookmarkService } from '../services/bookmark.service';
import { PhrasalVerb } from '../models/phrasal-verb.model';
import { Meaning } from '../models/meaning.model';
import { FixedPreposition } from '../models/fixed-preposition.model';

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
  private meanings: Meaning[] = [];
  private fixedPrepositions: FixedPreposition[] = [];

  constructor(
    private stateService: StateService,
    private formatterService: ExampleFormatterService,
    private dataService: DataService,
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
      id: synonym.id,
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
      id: antonym.id,
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
      id: oneWord.id,
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
      id: idiom.id,
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
    return {
      id: phrasalVerb.id,
      question: phrasalVerb.phrase,

      answer: phrasalVerb.meaning,

      options: this.randomService.buildOptions(
        phrasalVerb,
        this.dataService.getPhrasalVerbs(),
        (s) => [s.meaning],
        (s) => s.phrase,
        phrasalVerb.meaning,
      ),

      data: phrasalVerb,

      inputType: InputType.TextAndMultipleChoice,

      displayType: 'text',

      explanation: this.formatPhrasalVerbExplanation(phrasalVerb),
    };
  }

  private formatPhrasalVerbExplanation(phrasalVerb: PhrasalVerb): string {
    const formattedExample = this.formatterService.formatExample(
      phrasalVerb.phrase,
      phrasalVerb.example,
    );

    return `
    <strong>${phrasalVerb.phrase}</strong><br>
    ${phrasalVerb.meaning}<br><br>

    <strong>Ex:- </strong>
    ${formattedExample}
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

  generateMeaningQuestion(): Question<Meaning> {
    return this.createMeaningQuestion(this.nextMeaning());
  }

  createMeaningQuestion(meaning: Meaning): Question<Meaning> {
    return {
      id: meaning.id,
      question: meaning.word,

      answer: meaning.meaning,

      options: this.randomService.buildOptions(
        meaning,
        this.dataService.getMeanings(),
        (s) => [s.meaning],
        (s) => s.word,
        meaning.meaning,
      ),

      data: meaning,

      inputType: InputType.TextAndMultipleChoice,

      displayType: 'text',

      explanation: this.formatMeaningExplanation(meaning),
    };
  }

  private formatMeaningExplanation(meaning: Meaning): string {
    const formattedExample = this.formatterService.formatExample(
      meaning.word,
      meaning.example,
    );

    return `
    <strong>${meaning.word}</strong><br>
    ${meaning.meaning}<br><br>

    <strong>Ex:- </strong>
    ${formattedExample}
  `;
  }

  private nextMeaning(): Meaning {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalMeaning();
      case 'bookmark':
        return this.nextBookmarkMeaning();
    }
  }

  private nextNormalMeaning(): Meaning {
    if (this.meanings.length === 0) {
      this.meanings = this.randomService.shuffle([...this.getMeanings()]);
    }

    return this.meanings.shift()!;
  }

  private nextBookmarkMeaning(): Meaning {
    if (this.meanings.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<Meaning>();
      this.meanings = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.meanings.shift()!;
  }

  generateFixedPrepositionQuestion(): Question<FixedPreposition> {
    return this.createFixedPrepositionQuestion(this.nextFixedPreposition());
  }

  createFixedPrepositionQuestion(
    fixedPreposition: FixedPreposition,
  ): Question<FixedPreposition> {
    return {
      id: fixedPreposition.id,
      question: this.replacePrepositionWithBlank(
        fixedPreposition.expression,
        fixedPreposition.preposition,
      ),

      answer: fixedPreposition.preposition,

      options: this.randomService.buildOptions(
        fixedPreposition,
        this.dataService.getFixedPrepositions(),
        (s) => [s.preposition],
        (s) => s.word,
        fixedPreposition.preposition,
      ),

      data: fixedPreposition,

      inputType: InputType.TextAndMultipleChoice,

      displayType: 'text',

      explanation: this.formatFixedPrepositionExplanation(fixedPreposition),
    };
  }

  private formatFixedPrepositionExplanation(
    fixedPreposition: FixedPreposition,
  ): string {
    const formattedExample = this.formatterService.formatExample(
      fixedPreposition.expression,
      fixedPreposition.example,
    );

    return `
    <strong>${fixedPreposition.expression}</strong><br>
    ${fixedPreposition.meaning}<br><br>

    <strong>Ex:- </strong>
    ${formattedExample}
  `;
  }

  private nextFixedPreposition(): FixedPreposition {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalFixedPreposition();
      case 'bookmark':
        return this.nextBookmarkFixedPreposition();
    }
  }

  private nextNormalFixedPreposition(): FixedPreposition {
    if (this.fixedPrepositions.length === 0) {
      this.fixedPrepositions = this.randomService.shuffle([
        ...this.getFixedPrepositions(),
      ]);
    }

    return this.fixedPrepositions.shift()!;
  }

  private nextBookmarkFixedPreposition(): FixedPreposition {
    if (this.fixedPrepositions.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<FixedPreposition>();
      this.fixedPrepositions = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.fixedPrepositions.shift()!;
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

  private getMeanings(): Meaning[] {
    return this.dataService.getMeanings().slice(0, this.getWordLimit());
  }

  private getFixedPrepositions(): FixedPreposition[] {
    return this.dataService
      .getFixedPrepositions()
      .slice(0, this.getWordLimit());
  }

  getVocabularyCount(): number {
    return this.dataService.getCurrentReferenceData().length;
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

  private replacePrepositionWithBlank(
    expression: string,
    preposition: string,
  ): string {
    const escapedPreposition = preposition.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );
    const regex = new RegExp(`\\b${escapedPreposition}\\b`, 'i');

    return expression.replace(regex, '_____');
  }

  reset() {
    this.synonyms = [];
    this.antonyms = [];
    this.oneWords = [];
    this.idioms = [];
    this.phrasalVerbs = [];
    this.meanings = [];
    this.fixedPrepositions = [];
  }
}
