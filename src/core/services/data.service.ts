import { Injectable, signal } from '@angular/core';

import { PracticeMode } from '../enums/practice-mode.enum';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { Alphabet } from '../models/alphabet.model';
import { Antonym } from '../models/antonym.model';
import { Article } from '../models/article.model';
import { Cube } from '../models/cube.model';
import { CubeRoot } from '../models/cube-root.model';
import { FractionConversion } from '../models/fraction-conversion.model';
import { Idiom } from '../models/idiom.model';
import { OneWord } from '../models/one-word.model';
import { PhrasalVerb } from '../models/phrasal-verb.model';
import { Square } from '../models/square.model';
import { SquareRoot } from '../models/square-root.model';
import { Synonym } from '../models/synonym.model';
import { TableQuestion } from '../models/table-question.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly alphabets = signal<Alphabet[]>([]);
  private readonly tables = signal<TableQuestion[]>([]);

  private readonly squares = signal<Square[]>([]);
  private readonly cubes = signal<Cube[]>([]);
  private readonly squareRoots = signal<SquareRoot[]>([]);
  private readonly cubeRoots = signal<CubeRoot[]>([]);

  private readonly fractionConversions = signal<FractionConversion[]>([]);

  private readonly articles = signal<Article[]>([]);

  private readonly synonyms = signal<Synonym[]>([]);
  private readonly antonyms = signal<Antonym[]>([]);
  private readonly oneWords = signal<OneWord[]>([]);
  private readonly idioms = signal<Idiom[]>([]);
  private readonly phrasalVerbs = signal<PhrasalVerb[]>([]);

  constructor(private http: HttpClient) {}

  async preloadForMode(mode?: PracticeMode): Promise<void> {
    switch (mode) {
      // Alphabet
      case PracticeMode.LetterToPosition:
      case PracticeMode.PositionToLetter:
      case PracticeMode.LetterToReversePosition:
      case PracticeMode.ReversePositionToLetter:
      case PracticeMode.MirrorLetter:
        await this.loadAlphabets();
        break;

      // Tables
      case PracticeMode.Tables:
        await this.loadTables();
        break;

      // Powers
      case PracticeMode.Squares:
        await this.loadSquares();
        break;

      case PracticeMode.Cubes:
        await this.loadCubes();
        break;

      case PracticeMode.SquareRoots:
        await this.loadSquareRoots();
        break;

      case PracticeMode.CubeRoots:
        await this.loadCubeRoots();
        break;

      // Conversions
      case PracticeMode.FractionToDecimal:
      case PracticeMode.DecimalToFraction:
      case PracticeMode.FractionToPercentage:
      case PracticeMode.PercentageToFraction:
      case PracticeMode.DecimalToPercentage:
      case PracticeMode.PercentageToDecimal:
        await this.loadFractionConversions();
        break;

      // Polity
      case PracticeMode.ArticleToTitle:
      case PracticeMode.TitleToArticle:
        await this.loadArticles();
        break;

      // Vocabulary
      case PracticeMode.Synonyms:
        await this.loadSynonyms();
        break;

      case PracticeMode.Antonyms:
        await this.loadAntonyms();
        break;

      case PracticeMode.OneWord:
        await this.loadOneWords();
        break;

      case PracticeMode.Idioms:
        await this.loadIdioms();
        break;

      case PracticeMode.PhrasalVerbs:
        await this.loadPhrasalVerbs();
        break;

      default:
        break;
    }
  }

  // ========================================
  // Alphabet
  // ========================================

  async loadAlphabets(): Promise<void> {
    if (this.alphabets.length > 0) {
      return;
    }

    this.alphabets.set(
      await firstValueFrom(this.http.get<Alphabet[]>('data/alphabet.json')),
    );
  }

  getAlphabets(): Alphabet[] {
    return this.alphabets();
  }

  // ========================================
  // Tables
  // ========================================

  async loadTables(): Promise<void> {
    if (this.tables.length > 0) {
      return;
    }

    this.tables.set(
      await firstValueFrom(this.http.get<TableQuestion[]>('data/tables.json')),
    );
  }

  getTables(): TableQuestion[] {
    return this.tables();
  }

  // ========================================
  // Powers
  // ========================================

  async loadSquares(): Promise<void> {
    if (this.squares.length > 0) {
      return;
    }

    this.squares.set(
      await firstValueFrom(this.http.get<Square[]>('data/squares.json')),
    );
  }

  getSquares(): Square[] {
    return this.squares();
  }

  async loadCubes(): Promise<void> {
    if (this.cubes.length > 0) {
      return;
    }

    this.cubes.set(
      await firstValueFrom(this.http.get<Cube[]>('data/cubes.json')),
    );
  }

  getCubes(): Cube[] {
    return this.cubes();
  }

  async loadSquareRoots(): Promise<void> {
    if (this.squareRoots.length > 0) {
      return;
    }

    this.squareRoots.set(
      await firstValueFrom(
        this.http.get<SquareRoot[]>('data/square-roots.json'),
      ),
    );
  }

  getSquareRoots(): SquareRoot[] {
    return this.squareRoots();
  }

  async loadCubeRoots(): Promise<void> {
    if (this.cubeRoots.length > 0) {
      return;
    }

    this.cubeRoots.set(
      await firstValueFrom(this.http.get<CubeRoot[]>('data/cube-roots.json')),
    );
  }

  getCubeRoots(): CubeRoot[] {
    return this.cubeRoots();
  }

  // ========================================
  // Conversions
  // ========================================

  async loadFractionConversions(): Promise<void> {
    if (this.fractionConversions.length > 0) {
      return;
    }

    this.fractionConversions.set(
      await firstValueFrom(
        this.http.get<FractionConversion[]>('data/fraction-conversions.json'),
      ),
    );
  }

  getFractionConversions(): FractionConversion[] {
    return this.fractionConversions();
  }

  // ========================================
  // Polity
  // ========================================

  async loadArticles(): Promise<void> {
    if (this.articles.length > 0) {
      return;
    }

    this.articles.set(
      await firstValueFrom(this.http.get<Article[]>('data/articles.json')),
    );
  }

  getArticles(): Article[] {
    return this.articles();
  }

  // ========================================
  // Vocabulary
  // ========================================

  async loadSynonyms(): Promise<void> {
    if (this.synonyms.length > 0) {
      return;
    }

    this.synonyms.set(
      await firstValueFrom(this.http.get<Synonym[]>('data/synonyms.json')),
    );
  }

  getSynonyms(): Synonym[] {
    return this.synonyms();
  }

  async loadAntonyms(): Promise<void> {
    if (this.antonyms.length > 0) {
      return;
    }

    this.antonyms.set(
      await firstValueFrom(this.http.get<Antonym[]>('data/antonyms.json')),
    );
  }

  getAntonyms(): Antonym[] {
    return this.antonyms();
  }

  async loadOneWords(): Promise<void> {
    if (this.oneWords.length > 0) {
      return;
    }

    this.oneWords.set(
      await firstValueFrom(this.http.get<OneWord[]>('data/one-words.json')),
    );
  }

  getOneWords(): OneWord[] {
    return this.oneWords();
  }

  async loadIdioms(): Promise<void> {
    if (this.idioms.length > 0) {
      return;
    }

    this.idioms.set(
      await firstValueFrom(this.http.get<Idiom[]>('data/idioms.json')),
    );
  }

  getIdioms(): Idiom[] {
    return this.idioms();
  }

  async loadPhrasalVerbs(): Promise<void> {
    if (this.phrasalVerbs.length > 0) {
      return;
    }

    this.phrasalVerbs.set(
      await firstValueFrom(
        this.http.get<PhrasalVerb[]>('data/phrasal-verbs.json'),
      ),
    );
  }

  getPhrasalVerbs(): PhrasalVerb[] {
    return this.phrasalVerbs();
  }

  // ========================================
  // PDF
  // ========================================

  async loadPdf(src: string): Promise<Blob> {
    return firstValueFrom(
      this.http.get(src, {
        responseType: 'blob',
      }),
    );
  }
}
