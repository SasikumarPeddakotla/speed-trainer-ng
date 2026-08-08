import { Component, computed, inject, input } from '@angular/core';

import { PolityEngine } from '../../../core/engines/polity.engine';
import { Article } from '../../../core/models/article.model';
import { SettingsService } from '../../../core/services/settings.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { ReviewService } from '../../../core/services/review.service';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { Direction } from '../../../core/enums/direction.enum';
import { IdService } from '../../../utils/id.service';

@Component({
  selector: 'app-polity-reference',
  imports: [],
  templateUrl: './polity-reference.component.html',
  styleUrl: './polity-reference.component.scss',
})
export class PolityReferenceComponent {
  searchText = input<string>();

  private polityEngine = inject(PolityEngine);
  private settingsService = inject(SettingsService);
  private reviewService = inject(ReviewService);
  private bookmarkService = inject(BookmarkService);
  private idService = inject(IdService);

  private removedBookmarks = new Set<unknown>();

  referenceTab = input<'all' | 'weak' | 'bookmark'>();

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  get articles(): Article[] {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarks<Article>(this.mode);

      case 'weak':
        return this.reviewService.getPendingQuestions<Article>(this.mode);

      default:
        return this.polityEngine.getArticlesReference();
    }
  }

  readonly filteredArticles = computed(() => {
    const search = this.searchText()!.trim().toLowerCase();

    const articles = [...this.articles].sort((a, b) =>
      a.article.localeCompare(b.article, undefined, { numeric: true }),
    );

    if (!search) {
      return articles;
    }

    return articles.filter(
      (article) =>
        article.article.toLowerCase().includes(search) ||
        article.title.toLowerCase().includes(search),
    );
  });

  toggleBookmark(article: Article): void {
    const entry = {
      id: this.getQuestionId(article),
      mode: this.mode,
      question: article,
    };

    if (this.removedBookmarks.has(article)) {
      this.bookmarkService.add(entry);
      this.removedBookmarks.delete(article);
    } else {
      this.bookmarkService.remove(entry);
      this.removedBookmarks.add(article);
    }
  }

  private getQuestionId(article: Article): string {
    const direction = this.settingsService.settings().direction;

    return direction === Direction.Forward
      ? this.idService.getQuestionId(article.article)
      : this.idService.getQuestionId(article.title);
  }

  isRemoved(question: unknown): boolean {
    return this.removedBookmarks.has(question);
  }
}
