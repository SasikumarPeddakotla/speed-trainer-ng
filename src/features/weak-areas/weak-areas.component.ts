import { Component, inject } from '@angular/core';

import { exercises } from '../../core/data/exercises';
import { ReviewService } from '../../core/services/review.service';
import { PracticeMode } from '../../core/enums/practice-mode.enum';
import { ReviewTopic } from '../../core/models/review-topic.model';
import { topics } from '../../core/data/topics';

import { Exercise } from '../../core/models/exercise.model';
import { Router } from '@angular/router';
import { StudyListService } from '../../core/services/study-list.service';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-weak-areas',
  standalone: true,
  imports: [],
  templateUrl: './weak-areas.component.html',
  styleUrl: './weak-areas.component.scss',
})
export class WeakAreasComponent {
  private reviewService = inject(ReviewService);
  private router = inject(Router);
  private studyListService = inject(StudyListService);
  private settingsService = inject(SettingsService);

  get reviewTopics(): ReviewTopic[] {
    const grouped = new Map<string, ReviewTopic>();

    for (const exercise of exercises) {
      const count = this.reviewService.getPendingCount(exercise.mode);

      const topicTitle =
        topics.find((t) => t.route === exercise.topic)?.title ?? exercise.topic;

      if (!grouped.has(exercise.topic)) {
        grouped.set(exercise.topic, {
          title: topicTitle,
          total: 0,
          exercises: [],
        });
      }

      const topic = grouped.get(exercise.topic)!;

      topic.total += count;

      topic.exercises.push({
        exercise,
        count,
      });
    }

    return [...grouped.values()].filter((topic) => topic.total > 0);
  }

  // clearReviewQueue(mode: PracticeMode) {
  //   const topic = this.reviewTopics.find((topic) =>
  //     topic.exercises.some((e) => e.exercise.mode === mode),
  //   );

  //   const review = topic?.exercises.find((e) => e.exercise.mode === mode);

  //   if (!review || review.count === 0) {
  //     return;
  //   }

  //   const confirmed = confirm(
  //     `Clear ${review.count} pending review${review.count === 1 ? '' : 's'} for "${review.exercise.title}"?`,
  //   );

  //   if (!confirmed) {
  //     return;
  //   }

  //   this.reviewService.clearQueue(mode);
  // }

  // clearAll() {
  //   if (this.totalPendingReviews === 0) {
  //     return;
  //   }

  //   const confirmed = confirm(
  //     `Clear all ${this.totalPendingReviews} pending reviews?`,
  //   );

  //   if (!confirmed) {
  //     return;
  //   }

  //   this.reviewService.clear();
  // }

  // get hasPendingReviews(): boolean {
  //   return this.totalPendingReviews > 0;
  // }

  get totalPendingReviews(): number {
    return this.reviewTopics.reduce((sum, topic) => sum + topic.total, 0);
  }

  openWeakArea(exercise: Exercise): void {
    const questions = this.reviewService.getPendingQuestions(exercise.mode);

    this.studyListService.setQuestions(questions);

    this.settingsService.setExercise(exercise);

    const topic = topics.find((t) => t.route === exercise.topic)!;
    this.settingsService.setTopic(topic);

    this.router.navigate([`${exercise.route}/reference`]);
  }
}
