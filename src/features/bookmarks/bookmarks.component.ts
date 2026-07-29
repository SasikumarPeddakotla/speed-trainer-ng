import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { exercises } from '../../core/data/exercises';
import { topics } from '../../core/data/topics';

import { BookmarkService } from '../../core/services/bookmark.service';
import { SettingsService } from '../../core/services/settings.service';

import { Exercise } from '../../core/models/exercise.model';
import { ReviewTopic } from '../../core/models/review-topic.model';

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

    for (const exercise of exercises) {
      const count = this.bookmarkService.getBookmarkCount(exercise.mode);

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

  get totalBookmarks(): number {
    return this.bookmarkTopics.reduce((sum, topic) => sum + topic.total, 0);
  }

  openBookmarks(exercise: Exercise): void {
    this.settingsService.setExercise(exercise);

    const topic = topics.find((t) => t.route === exercise.topic)!;
    this.settingsService.setTopic(topic);

    this.settingsService.setReferenceView('bookmark');

    this.router.navigate([`${exercise.route}/reference`]);
  }

  // openTrainer(){

  // }
}
