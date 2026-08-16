import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../../core/services/session.service';
import { StateService } from '../../core/services/state.service';
import { BookmarkService } from '../../core/services/bookmark.service';

import { AttemptedQuestion } from '../../core/models/attempted-question.model';
import { QuestionService } from '../../core/services/question.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  constructor(
    public sessionService: SessionService,
    private stateService: StateService,
    private bookmarkService: BookmarkService,
    private router: Router,
    private questionService: QuestionService,
  ) {}

  get attempts(): AttemptedQuestion[] {
    return this.sessionService.attemptHistory();
  }

  get mistakes(): AttemptedQuestion[] {
    return this.sessionService.mistakes();
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

    // Reset statistics for the new practice session.
    this.sessionService.reset();

    // Give the trainer the temporary mistake list.
    this.questionService.startTemporaryPractice(questions);

    const exercise = this.stateService.navigation().selectedExercise;

    if (!exercise) {
      return;
    }

    this.router.navigate([`/${exercise.route}/trainer`]);
  }

  practiceAgain(): void {
    // Reset statistics for the new practice session.
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
