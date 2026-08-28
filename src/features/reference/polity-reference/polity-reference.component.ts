import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { PolityEngine } from '../../../core/engines/polity.engine';
import { Article } from '../../../core/models/article.model';
import { StateService } from '../../../core/services/state.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { BookmarkService } from '../../../core/services/bookmark.service';

@Component({
  selector: 'app-polity-reference',
  imports: [],
  templateUrl: './polity-reference.component.html',
  styleUrl: './polity-reference.component.scss',
})
export class PolityReferenceComponent {
  searchText = input<string>();

  private polityEngine = inject(PolityEngine);
  private stateService = inject(StateService);
  private bookmarkService = inject(BookmarkService);

  referenceTab = input<'all' | 'bookmark'>();
  count = output<{
    allCount: number;
    bookmarkCount: number;
  }>();

  protected readonly mode = this.stateService.navigation().selectedExercise
    ?.mode as PracticeMode;

  private readonly allQuestions = computed(() => {
    return this.polityEngine.getArticlesReference();
  });
  private readonly bookmarkQuestions = computed(() => {
    return this.bookmarkService.getBookmarkedQuestions<Article>();
  });

  // To return the counts to parent
  private readonly emitCountsEffect = effect(() => {
    this.count.emit({
      allCount: this.allQuestions().length,
      bookmarkCount: this.bookmarkQuestions().length,
    });
  });

  get articles(): Article[] {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkQuestions();

      default:
        return this.allQuestions();
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

  async toggleBookmark(article: Article): Promise<void> {
    const entry = {
      id: article.id,
      mode: this.mode,
      question: article,
    };

    this.bookmarkService.toggle(entry);
  }

  isBookmarked(article: Article): boolean {
    return this.bookmarkService.isBookmarked(article.id);
  }
}
