import { inject, Injectable } from '@angular/core';
import { RandomService } from '../../utils/random.service';
import { Question } from '../models/question.model';
import { Article } from '../models/article.model';
import { IdService } from '../../utils/id.service';
import { StateService } from '../services/state.service';
import { BookmarkService } from '../services/bookmark.service';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root',
})
export class PolityEngine {
  private randomService = inject(RandomService);
  private articles: Article[] = [];

  constructor(
    private idService: IdService,
    private stateService: StateService,
    private bookmarkService: BookmarkService,
    private dataService: DataService,
  ) {}

  generateArticleToTitle(): Question<Article> {
    const article = this.nextArticle();
    return this.createArticleToTitleQuestion(article);
  }

  createArticleToTitleQuestion(article: Article): Question<Article> {
    return {
      id: this.idService.getQuestionId(article.article),
      question: `Article ${article.article}`,
      answer: article.title,
      options: this.randomService.buildOptions(
        article,
        this.dataService.getArticles(),
        (a) => [a.title],
        (a) => a.article,
        article.title,
      ),
      data: article,
      inputType: 'multiple-choice',
      displayType: 'text',
    };
  }

  generateTitleToArticle(): Question<Article> {
    const article = this.nextArticle();
    return this.createTitleToArticleQuestion(article);
  }

  createTitleToArticleQuestion(article: Article): Question<Article> {
    return {
      id: this.idService.getQuestionId(article.title),
      question: article.title,
      answer: `Article ${article.article}`,
      options: this.randomService.buildOptions(
        article,
        this.dataService.getArticles(),
        (a) => [`Article ${a.article}`],
        (a) => a.title,
        `Article ${article.article}`,
      ),
      data: article,
      inputType: 'multiple-choice',
      displayType: 'text',
    };
  }

  private nextArticle(): Article {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalArticle();
      case 'bookmark':
        return this.nextBookmarkArticle();
    }
  }

  private nextNormalArticle(): Article {
    if (this.articles.length === 0) {
      this.articles = this.randomService.shuffle([
        ...this.dataService.getArticles(),
      ]);
    }

    return this.articles.shift()!;
  }

  private nextBookmarkArticle(): Article {
    if (this.articles.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<Article>();
      this.articles = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.articles.shift()!;
  }

  getArticlesReference(): Article[] {
    return this.dataService.getArticles();
  }

  reset() {
    this.articles = [];
  }
}
