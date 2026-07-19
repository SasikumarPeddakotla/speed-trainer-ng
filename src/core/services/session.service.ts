import { computed, Injectable, signal } from '@angular/core';
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

  private readonly _finished = signal(false);

  readonly finished = this._finished.asReadonly();

  readonly accuracy = computed(() => {
    const session = this._session();

    const total = session.correctCount + session.wrongCount;

    if (total === 0) {
      return 100;
    }

    return Math.round((session.correctCount / total) * 100);
  });

  readonly totalQuestions = computed(() => {
    const session = this._session();

    return session.correctCount + session.wrongCount;
  });

  readonly currentStreak = computed(() => {
    return this._session().streakCount;
  });

  readonly correctCount = computed(() => this._session().correctCount);

  readonly wrongCount = computed(() => this._session().wrongCount);

  readonly bestStreak = computed(() => this._session().bestStreak);

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

    this._finished.set(false);
  }

  finish() {
    this._finished.set(true);
  }
}
