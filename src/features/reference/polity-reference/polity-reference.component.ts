import { Component, computed, inject, input } from '@angular/core';

import { PolityEngine } from '../../../core/engines/polity.engine';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-polity-reference',
  imports: [],
  templateUrl: './polity-reference.component.html',
  styleUrl: './polity-reference.component.scss',
})
export class PolityReferenceComponent {
  searchText = input<string>();

  private polityEngine = inject(PolityEngine);

  protected readonly articles: Article[] =
    this.polityEngine.getArticlesReference();

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
