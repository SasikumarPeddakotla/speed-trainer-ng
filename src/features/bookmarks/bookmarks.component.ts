import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { exercises } from '../../core/data/exercises';
import { topics } from '../../core/data/topics';

import { BookmarkService } from '../../core/services/bookmark.service';
import { StateService } from '../../core/services/state.service';

import { Exercise } from '../../core/models/exercise.model';
import { PracticeMode } from '../../core/enums/practice-mode.enum';
import { SessionType } from '../../core/enums/session-type.enum';
import { Topic } from '../../core/models/topic.model';
import { subjects } from '../../core/data/subjects';
import { Subject } from '../../core/models/subject.model';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss',
})
export class BookmarksComponent {
  private bookmarkService = inject(BookmarkService);

  private stateService = inject(StateService);

  private router = inject(Router);

  get bookmarkTopics() {
    const grouped = new Map<string, any>();

    for (const [
      exerciseKey,
      entries,
    ] of this.bookmarkService.getBookmarkGroups()) {
      const exercise = exercises.find((e) => e.mode === exerciseKey);

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

      topic.total += entries.length;

      topic.exercises.push({
        exercise,
        count: entries.length,
      });
    }

    return [...grouped.values()];
  }

  get totalBookmarks(): number {
    return this.bookmarkService.getTotalBookmarks();
  }

  openBookmarks(exercise: Exercise): void {
    this.stateService.setExercise(exercise);

    const topic = topics.find((t) => t.route === exercise.topic)!;
    this.stateService.setTopic(topic);

    const subject = subjects.find((s) => s.route === topic.subject)!;
    this.stateService.setSubject(subject);

    this.stateService.setReferenceView('bookmark');

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
    const subject: Subject = {
      title: 'Bookmarks',
      route: 'bookmarks',
      icon: '',
    };

    this.stateService.setExercise(exercise);
    this.stateService.setTopic(topic);
    this.stateService.setSubject(subject);

    this.stateService.setSessionType(SessionType.QuestionChallenge);

    this.stateService.setQuestionTarget(this.totalBookmarks);

    this.router.navigate([exercise.route, 'practice-settings']);
  }
}
