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
import { SettingType } from '../../core/enums/setting-type.enum';
import { Direction } from '../../core/enums/direction.enum';

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
      const [mode, direction] = summary.exerciseKey.split('_');

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

      // Create a display exercise object
      const displayExercise: Exercise = {
        ...exercise,
        title: this.getDisplayTitle(exercise.title, direction as Direction),
      };

      topic.exercises.push({
        exercise: displayExercise,
        count: summary.count,
      });
    }

    return [...grouped.values()];
  }

  get totalBookmarks(): number {
    return this.bookmarkTopics.reduce((sum, topic) => sum + topic.total, 0);
  }

  openBookmarks(exercise: Exercise): void {
    this.settingsService.setExercise(exercise);

    // Detect direction from title
    if (exercise.title.includes('(Forward)')) {
      this.settingsService.setDirection(Direction.Forward);
    } else if (exercise.title.includes('(Backward)')) {
      this.settingsService.setDirection(Direction.Backward);
    }

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

  private getExerciseKey(exercise: Exercise): string {
    // Exercises without direction
    if (!exercise.settings.some((s) => s === SettingType.Direction)) {
      return exercise.mode;
    }

    // Count both directions
    const forward = `${exercise.mode}_Forward`;
    const backward = `${exercise.mode}_Backward`;

    return [forward, backward].join('|');
  }

  private getExerciseBookmarkCount(exercise: Exercise): number {
    const hasDirection = exercise.settings.some(
      (s) => s === SettingType.Direction,
    );

    if (!hasDirection) {
      return this.bookmarkService.getBookmarkCountForExerciseKey(exercise.mode);
    }

    return (
      this.bookmarkService.getBookmarkCountForExerciseKey(
        `${exercise.mode}_Forward`,
      ) +
      this.bookmarkService.getBookmarkCountForExerciseKey(
        `${exercise.mode}_Backward`,
      )
    );
  }

  private getDisplayTitle(title: string, direction?: Direction): string {
    if (!direction) {
      return title;
    }

    return `${title} (${direction})`;
  }
}
