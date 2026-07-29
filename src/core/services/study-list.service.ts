import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StudyListService {
  private questions: unknown[] | null = null;

  setQuestions<T>(questions: T[]): void {
    this.questions = questions;
  }

  getQuestions<T>(): T[] | null {
    return this.questions as T[] | null;
  }

  clear(): void {
    this.questions = null;
  }

  hasQuestions(): boolean {
    return this.questions !== null;
  }
}
