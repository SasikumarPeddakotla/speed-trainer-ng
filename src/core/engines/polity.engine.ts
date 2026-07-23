import { Injectable } from '@angular/core';
import { RandomService } from '../../utils/random.service';
import { ArticleQuestionData } from '../models/article-question-data.model';
import { Question } from '../models/question.model';
import { SettingsService } from '../services/settings.service';
import { ARTICLES } from '../data/articles.data';
import { Article } from '../models/article.model';
import { Direction } from '../enums/direction.enum';

@Injectable({
  providedIn: 'root',
})
export class PolityEngine {
  constructor(
    private settingsService: SettingsService,
    private randomService: RandomService,
  ) {}

  generateArticles(): Question<ArticleQuestionData> {
    const article = this.getRandomArticle();

    const direction = this.settingsService.settings().direction;
    const options = this.buildOptions(article);

    if (direction === Direction.Forward) {
      return {
        question: `Article ${article.article}`,
        answer: article.title,
        data: {
          options,
        },
        inputType: 'multiple-choice',
        displayType: 'text',
      };
    }

    return {
      question: article.title,
      answer: `Article ${article.article}`,
      data: {
        options,
      },
      inputType: 'multiple-choice',
      displayType: 'text',
    };
  }

  private previousArticle?: Article;

  private getRandomArticle(): Article {
    let article: Article;

    do {
      article = ARTICLES[this.randomService.random(0, ARTICLES.length - 1)];
    } while (article === this.previousArticle);

    this.previousArticle = article;

    return article;
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
