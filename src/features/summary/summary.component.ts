import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../../core/services/session.service';
import { StateService } from '../../core/services/state.service';
import { BookmarkService } from '../../core/services/bookmark.service';

import { AttemptedQuestion } from '../../core/models/attempted-question.model';
import { QuestionService } from '../../core/services/question.service';

type AttemptFilter = 'all' | 'correct' | 'wrong';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  private stateService = inject(StateService);
  private bookmarkService = inject(BookmarkService);
  private router = inject(Router);
  private questionService = inject(QuestionService);

  readonly attemptFilter = signal<AttemptFilter>('all');

  constructor(public sessionService: SessionService) {}

  get attempts(): AttemptedQuestion[] {
    return this.sessionService.attemptHistory();
  }

  get mistakes(): AttemptedQuestion[] {
    return this.sessionService.mistakes();
  }

  get filteredAttempts(): AttemptedQuestion[] {
    switch (this.attemptFilter()) {
      case 'correct':
        return this.attempts.filter((attempt) => attempt.correct);

      case 'wrong':
        return this.attempts.filter((attempt) => !attempt.correct);

      default:
        return this.attempts;
    }
  }

  get correctAttemptCount(): number {
    return this.attempts.filter((attempt) => attempt.correct).length;
  }

  get wrongAttemptCount(): number {
    return this.attempts.filter((attempt) => !attempt.correct).length;
  }

  setAttemptFilter(filter: AttemptFilter): void {
    this.attemptFilter.set(filter);
  }

  isBookmarked(attempt: AttemptedQuestion): boolean {
    return this.bookmarkService.isBookmarked(attempt.question.id);
  }

  async toggleBookmark(attempt: AttemptedQuestion): Promise<void> {
    const exercise = this.stateService.navigation().selectedExercise;

    if (!exercise || !attempt.question.data) {
      return;
    }

    await this.bookmarkService.toggle({
      id: attempt.question.id,
      mode: exercise.mode,
      question: attempt.question.data,
    });
  }

  practiceMistakes(): void {
    const mistakes = this.sessionService.uniqueMistakes();

    if (mistakes.length === 0) {
      return;
    }

    const questions = mistakes.map((attempt) => attempt.question);

    this.stateService.setQuestionTarget(questions.length);

    this.sessionService.reset();

    this.questionService.startTemporaryPractice(questions);

    const exercise = this.stateService.navigation().selectedExercise;

    if (!exercise) {
      return;
    }

    this.router.navigate([`/${exercise.route}/trainer`]);
  }

  practiceAgain(): void {
    this.sessionService.reset();

    const exercise = this.stateService.navigation().selectedExercise;

    if (!exercise) {
      this.router.navigate(['/subjects']);
      return;
    }

    this.router.navigate([`/${exercise.route}/trainer`]);
  }

  goHome(): void {
    this.router.navigate(['/subjects']);
  }
}
