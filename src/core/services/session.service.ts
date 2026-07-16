import { Injectable, signal } from '@angular/core';
import { Session } from '../models/session.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly _session = signal<Session>({
    correctCount: 0,
    wrongCount: 0,
    streakCount: 0,
    bestStreak: 0,
    totalResponseTime: 0,
  });

  readonly session = this._session.asReadonly();

  correct() {
    this._session.update((session) => {
      const streak = session.streakCount + 1;

      return {
        ...session,
        correctCount: session.correctCount + 1,
        streakCount: streak,
        bestStreak: Math.max(session.bestStreak, streak),
      };
    });
  }

  wrong() {
    this._session.update((session) => ({
      ...session,
      wrongCount: session.wrongCount + 1,
      streakCount: 0,
    }));
  }

  reset() {
    this._session.set({
      correctCount: 0,
      wrongCount: 0,
      streakCount: 0,
      bestStreak: 0,
      totalResponseTime: 0,
    });
  }
}
