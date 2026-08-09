import { inject, Injectable } from '@angular/core';
import { RandomService } from '../../utils/random.service';
import { Question } from '../models/question.model';
import { ARTICLES } from '../data/articles.data';
import { Article } from '../models/article.model';
import { ReviewService } from '../services/review.service';
import { IdService } from '../../utils/id.service';

@Injectable({
  providedIn: 'root',
})
export class PolityEngine {
  private randomService = inject(RandomService);
  private articles = this.randomService.shuffle([...ARTICLES]);

  constructor(
    private reviewService: ReviewService,
    private idService: IdService,
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
        ARTICLES,
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
        ARTICLES,
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
    let review = this.reviewService.getNextReviewQuestion<Article>();

    if (review) {
      return review;
    }

    if (this.articles.length === 0) {
      let review = this.reviewService.getNextReviewQuestion<Article>();

      if (review) {
        return review;
      }

      this.articles = this.randomService.shuffle([...ARTICLES]);
    }

    return this.articles.shift()!;
  }

  getArticlesReference(): Article[] {
    return ARTICLES;
  }

  reset() {
    this.articles = [];
  }
}
