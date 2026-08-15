import { Injectable, signal } from '@angular/core';
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
  private readonly synonyms = signal<Synonym[]>([]);
  private readonly antonyms = signal<Antonym[]>([]);
  private readonly oneWords = signal<OneWord[]>([]);
  private readonly idioms = signal<Idiom[]>([]);

  constructor(private http: HttpClient) {}

  async ensureSynonymsLoaded(): Promise<void> {
    if (this.synonyms.length > 0) {
      return;
    }

    this.synonyms.set(
      await firstValueFrom(this.http.get<Synonym[]>('data/synonyms.json')),
    );
  }

  async ensureAntonymsLoaded(): Promise<void> {
    if (this.antonyms.length > 0) {
      return;
    }

    this.antonyms.set(
      await firstValueFrom(this.http.get<Antonym[]>('data/antonyms.json')),
    );
  }

  async ensureOneWordsLoaded(): Promise<void> {
    if (this.oneWords.length > 0) {
      return;
    }

    this.oneWords.set(
      await firstValueFrom(this.http.get<OneWord[]>('data/one-words.json')),
    );
  }

  async ensureIdiomsLoaded(): Promise<void> {
    if (this.idioms.length > 0) {
      return;
    }

    this.idioms.set(
      await firstValueFrom(this.http.get<Idiom[]>('data/idioms.json')),
    );
  }

  getSynonyms(): Synonym[] {
    return this.synonyms();
  }

  getAntonyms(): Antonym[] {
    return this.antonyms();
  }

  getOneWords(): OneWord[] {
    return this.oneWords();
  }

  getIdioms(): Idiom[] {
    return this.idioms();
  }
}
