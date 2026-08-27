import { Injectable, signal } from '@angular/core';

import { PracticeMode } from '../enums/practice-mode.enum';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Antonym } from '../models/antonym.model';
import { Idiom } from '../models/idiom.model';
import { OneWord } from '../models/one-word.model';
import { PhrasalVerb } from '../models/phrasal-verb.model';
import { Synonym } from '../models/synonym.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly synonyms = signal<Synonym[]>([]);
  private readonly antonyms = signal<Antonym[]>([]);
  private readonly oneWords = signal<OneWord[]>([]);
  private readonly idioms = signal<Idiom[]>([]);
  private readonly phrasalVerbs = signal<PhrasalVerb[]>([]);

  constructor(private http: HttpClient) {}

  async preloadForMode(mode?: PracticeMode): Promise<void> {
    switch (mode) {
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

  async loadSynonyms(): Promise<void> {
    if (this.synonyms.length > 0) {
      return;
    }

    this.synonyms.set(
      await firstValueFrom(this.http.get<Synonym[]>('data/synonyms.json')),
    );
  }

  async loadAntonyms(): Promise<void> {
    if (this.antonyms.length > 0) {
      return;
    }

    this.antonyms.set(
      await firstValueFrom(this.http.get<Antonym[]>('data/antonyms.json')),
    );
  }

  async loadOneWords(): Promise<void> {
    if (this.oneWords.length > 0) {
      return;
    }

    this.oneWords.set(
      await firstValueFrom(this.http.get<OneWord[]>('data/one-words.json')),
    );
  }

  async loadIdioms(): Promise<void> {
    if (this.idioms.length > 0) {
      return;
    }

    this.idioms.set(
      await firstValueFrom(this.http.get<Idiom[]>('data/idioms.json')),
    );
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

  async loadPdf(src: string): Promise<Blob> {
    return firstValueFrom(
      this.http.get(src, {
        responseType: 'blob',
      }),
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

  getPhrasalVerbs(): PhrasalVerb[] {
    return this.phrasalVerbs();
  }
}
