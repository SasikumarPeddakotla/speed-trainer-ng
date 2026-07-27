import { inject, Injectable } from '@angular/core';
import { RandomService } from '../../utils/random.service';
import { Question } from '../models/question.model';
import { SettingsService } from '../services/settings.service';
import { ARTICLES } from '../data/articles.data';
import { Article } from '../models/article.model';
import { Direction } from '../enums/direction.enum';
import { ReviewService } from '../services/review.service';

@Injectable({
  providedIn: 'root',
})
export class PolityEngine {
  private randomService = inject(RandomService);
  private articles = this.randomService.shuffle([...ARTICLES]);

  constructor(
    private settingsService: SettingsService,
    private reviewService: ReviewService,
  ) {}

  generateArticles(): Question<Article> {
    const article = this.nextArticle();

    const direction = this.settingsService.settings().direction;
    const options = this.buildOptions(article);

    if (direction === Direction.Forward) {
      return {
        question: `Article ${article.article}`,
        answer: article.title,
        options: options,
        data: article,
        inputType: 'multiple-choice',
        displayType: 'text',
      };
    }

    return {
      question: article.title,
      answer: `Article ${article.article}`,
      options: options,
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

  private getRandomArticle(): Article {
    return ARTICLES[this.randomService.random(0, ARTICLES.length - 1)];
  }

  private buildOptions(article: Article): string[] {
    const direction = this.settingsService.settings().direction;

    const correctOption =
      direction === Direction.Forward
        ? article.title
        : `Article ${article.article}`;

    const options = [correctOption];

    while (options.length < 4) {
      const randomArticle = this.getRandomArticle();

      const option =
        direction === Direction.Forward
          ? randomArticle.title
          : `Article ${randomArticle.article}`;

      if (!options.includes(option)) {
        options.push(option);
      }
    }

    return this.randomService.shuffle(options);
  }
}
