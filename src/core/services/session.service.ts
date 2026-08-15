import { computed, Injectable, signal } from '@angular/core';

import { Session } from '../models/session.model';
import { AttemptedQuestion } from '../models/attempted-question.model';
import { ReviewItem } from '../models/review-item.model';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  // -----------------------------
  // Session statistics
  // -----------------------------

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

  // -----------------------------
  // Attempt history
  // -----------------------------

  /**
   * Every question attempted during the current session.
   *
   * This is temporary and is cleared when the session is reset.
   */
  private readonly _attemptHistory = signal<AttemptedQuestion[]>([]);

  readonly attemptHistory = this._attemptHistory.asReadonly();

  /**
   * All attempts from the current session that were answered incorrectly.
   */
  readonly mistakes = computed(() =>
    this._attemptHistory().filter((attempt) => !attempt.correct),
  );

  readonly uniqueMistakes = computed(() => {
    const seen = new Set<string>();

    return this._attemptHistory().filter((attempt) => {
      if (attempt.correct) {
        return false;
      }

      if (seen.has(attempt.question.id)) {
        return false;
      }

      seen.add(attempt.question.id);

      return true;
    });
  });

  /**
   * Number of incorrect attempts made during the session.
   */
  readonly mistakeCount = computed(() => this.mistakes().length);

  // -----------------------------
  // Temporary review queue
  // -----------------------------

  /**
   * Questions answered incorrectly during the current session
   * that may be shown again after a delay.
   */
  private readonly _reviewQueue = signal<ReviewItem[]>([]);

  readonly reviewQueue = this._reviewQueue.asReadonly();

  // -----------------------------
  // Computed statistics
  // -----------------------------

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

  readonly correctCount = computed(() => {
    return this._session().correctCount;
  });

  readonly wrongCount = computed(() => {
    return this._session().wrongCount;
  });

  readonly bestStreak = computed(() => {
    return this._session().bestStreak;
  });

  // -----------------------------
  // Statistics
  // -----------------------------

  correct(): void {
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

  wrong(): void {
    this._session.update((session) => ({
      ...session,
      wrongCount: session.wrongCount + 1,
      streakCount: 0,
    }));
  }

  // -----------------------------
  // Attempt history
  // -----------------------------

  /**
   * Records every answer given by the user.
   */
  recordAttempt(
    question: Question,
    userAnswer: string,
    correct: boolean,
  ): void {
    this._attemptHistory.update((history) => [
      ...history,
      {
        question,
        userAnswer,
        correct,
      },
    ]);
  }

  // -----------------------------
  // Temporary review queue
  // -----------------------------

  /**
   * Adds a wrongly answered question to the temporary
   * review queue.
   */
  addToReviewQueue(question: Question): void {
    this._reviewQueue.update((queue) => {
      // Don't add the same question multiple times.
      if (queue.some((item) => item.question.id === question.id)) {
        return queue;
      }

      return [
        ...queue,
        {
          question,
          delay: 3,
        },
      ];
    });
  }

  /**
   * Returns the next review question whose delay has expired.
   *
   * The returned question is removed from the queue temporarily.
   * It can be added back if the user gets it wrong again.
   */
  getNextReviewQuestion(): Question | null {
    const queue = this._reviewQueue();

    const index = queue.findIndex((item) => item.delay <= 0);

    if (index === -1) {
      return null;
    }

    const [item] = queue.splice(index, 1);

    this._reviewQueue.set(queue);

    return item.question;
  }

  /**
   * Decreases the delay of all pending review questions.
   */
  advanceReviewDelays(): void {
    this._reviewQueue.update((queue) =>
      queue.map((item) => ({
        ...item,
        delay: Math.max(0, item.delay - 1),
      })),
    );
  }

  /**
   * Re-adds a question to the review queue after
   * the user gets the review question wrong.
   */
  requeueReviewQuestion(question: Question): void {
    this._reviewQueue.update((queue) => {
      const existing = queue.find((item) => item.question.id === question.id);

      if (existing) {
        return queue.map((item) =>
          item.question.id === question.id
            ? {
                ...item,
                delay: 3,
              }
            : item,
        );
      }

      return [
        ...queue,
        {
          question,
          delay: 3,
        },
      ];
    });
  }

  // -----------------------------
  // Session lifecycle
  // -----------------------------

  reset(): void {
    this._session.set({
      correctCount: 0,
      wrongCount: 0,
      streakCount: 0,
      bestStreak: 0,
      totalResponseTime: 0,
    });

    this._attemptHistory.set([]);
    this._reviewQueue.set([]);

    this._finished.set(false);
  }

  finish(): void {
    this._finished.set(true);
  }
}
