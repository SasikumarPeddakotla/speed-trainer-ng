import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { exercises } from '../../core/data/exercises';
import { topics } from '../../core/data/topics';

import { BookmarkService } from '../../core/services/bookmark.service';
import { SettingsService } from '../../core/services/settings.service';

import { Exercise } from '../../core/models/exercise.model';
import { ReviewTopic } from '../../core/models/review-topic.model';
import { PracticeMode } from '../../core/enums/practice-mode.enum';
import { SessionType } from '../../core/enums/session-type.enum';
import { Topic } from '../../core/models/topic.model';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss',
})
export class BookmarksComponent {
  private bookmarkService = inject(BookmarkService);

  private settingsService = inject(SettingsService);

  private router = inject(Router);

  get bookmarkTopics(): ReviewTopic[] {
    const grouped = new Map<string, ReviewTopic>();

    for (const summary of this.bookmarkService.getBookmarkSummaries()) {
      const mode = summary.exerciseKey;

      const exercise = exercises.find((e) => e.mode === mode);

      if (!exercise) {
        continue;
      }

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

      topic.total += summary.count;

      topic.exercises.push({
        exercise,
        count: summary.count,
      });
    }

    return [...grouped.values()];
  }

  get totalBookmarks(): number {
    return this.bookmarkService.getTotalBookmarks();
  }

  openBookmarks(exercise: Exercise): void {
    this.settingsService.setExercise(exercise);

    const topic = topics.find((t) => t.route === exercise.topic)!;

    this.settingsService.setTopic(topic);

    this.settingsService.setReferenceView('bookmark');

    this.router.navigate([`${exercise.route}/reference`]);
  }

  practiceBookmarks(): void {
    const exercise: Exercise = {
      title: 'Bookmarks',
      mode: PracticeMode.Bookmark,
      topic: 'bookmarks',
      route: 'bookmarks',
      implemented: true,
      settings: [],
    };

    const topic: Topic = {
      title: 'Bookmarks',
      route: 'bookmarks',
      subject: '',
      implemented: true,
    };

    this.settingsService.setExercise(exercise);

    this.settingsService.setTopic(topic);

    this.settingsService.setSessionType(SessionType.QuestionChallenge);

    this.settingsService.setQuestionTarget(this.totalBookmarks);

    this.router.navigate([exercise.route, 'practice-settings']);
  }
}
