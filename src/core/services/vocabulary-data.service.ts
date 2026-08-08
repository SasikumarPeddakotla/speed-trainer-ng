import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { Synonym } from '../models/synonym.model';
import { Antonym } from '../models/antonym.model';
import { OneWord } from '../models/one-word.model';
import { Idiom } from '../models/idiom.model';

@Injectable({
  providedIn: 'root',
})
export class VocabularyDataService {
  private synonyms: Synonym[] = [];

  private antonyms: Antonym[] = [];

  private oneWords: OneWord[] = [];

  private idioms: Idiom[] = [];

  constructor(private http: HttpClient) {}

  async ensureSynonymsLoaded(): Promise<void> {
    if (this.synonyms.length > 0) {
      return;
    }

    this.synonyms = await firstValueFrom(
      this.http.get<Synonym[]>('data/synonyms.json'),
    );
  }

  async ensureAntonymsLoaded(): Promise<void> {
    if (this.antonyms.length > 0) {
      return;
    }

    this.antonyms = await firstValueFrom(
      this.http.get<Antonym[]>('data/antonyms.json'),
    );
  }

  async ensureOneWordsLoaded(): Promise<void> {
    if (this.oneWords.length > 0) {
      return;
    }

    this.oneWords = await firstValueFrom(
      this.http.get<OneWord[]>('data/one-words.json'),
    );
  }

  async ensureIdiomsLoaded(): Promise<void> {
    if (this.idioms.length > 0) {
      return;
    }

    this.idioms = await firstValueFrom(
      this.http.get<Idiom[]>('data/idioms.json'),
    );
  }

  getSynonyms(): Synonym[] {
    return this.synonyms;
  }

  getAntonyms(): Antonym[] {
    return this.antonyms;
  }

  getOneWords(): OneWord[] {
    return this.oneWords;
  }

  getIdioms(): Idiom[] {
    return this.idioms;
  }
}
