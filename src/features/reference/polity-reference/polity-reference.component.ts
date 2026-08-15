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
import { ReviewService } from '../../../core/services/review.service';
import { BookmarkService } from '../../../core/services/bookmark.service';
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
  private stateService = inject(StateService);
  private reviewService = inject(ReviewService);
  private bookmarkService = inject(BookmarkService);
  private idService = inject(IdService);

  referenceTab = input<'all' | 'weak' | 'bookmark'>();
  count = output<{
    allCount: number;
    weakCount: number;
    bookmarkCount: number;
  }>();

  protected readonly mode = this.stateService.navigation().selectedExercise
    ?.mode as PracticeMode;

  private readonly allQuestions = this.polityEngine.getArticlesReference();
  private readonly weakQuestions = computed(() =>
    this.reviewService.getPendingQuestions<Article>(this.mode),
  );
  private readonly bookmarkQuestions = computed(() => {
    return this.bookmarkService.getBookmarkedQuestions<Article>();
  });

  // To return the counts to parent
  private readonly emitCountsEffect = effect(() => {
    this.count.emit({
      allCount: this.allQuestions.length,
      weakCount: this.weakQuestions().length,
      bookmarkCount: this.bookmarkQuestions().length,
    });
  });

  get articles(): Article[] {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkQuestions();

      case 'weak':
        return this.weakQuestions();

      default:
        return this.allQuestions;
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
      id: this.getQuestionId(article),
      mode: this.mode,
      question: article,
    };

    this.bookmarkService.toggle(entry);
  }

  private getQuestionId(article: Article): string {
    return this.mode === PracticeMode.ArticleToTitle
      ? this.idService.getQuestionId(article.article)
      : this.idService.getQuestionId(article.title);
  }

  isBookmarked(question: Article): boolean {
    return this.bookmarkService.isBookmarked(this.getQuestionId(question));
  }
}
