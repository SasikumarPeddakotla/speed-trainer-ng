import { Component, computed, inject, input } from '@angular/core';

import { PolityEngine } from '../../../core/engines/polity.engine';
import { Article } from '../../../core/models/article.model';
import { SettingsService } from '../../../core/services/settings.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { Alphabet } from '../../../core/models/alphabet.model';
import { ReviewService } from '../../../core/services/review.service';

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

  isWeakMode = input<boolean>();

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  get articles(): Article[] {
    if (this.isWeakMode()) {
      return this.reviewService.getPendingQuestions<Article>(this.mode);
    }

    return this.polityEngine.getArticlesReference();
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
}
