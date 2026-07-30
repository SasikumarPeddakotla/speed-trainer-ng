import { inject, Injectable } from '@angular/core';

import { SettingsService } from '../services/settings.service';
import { Question } from '../models/question.model';
import { TableQuestion } from '../models/table-question.model';
import { RandomService } from '../../utils/random.service';
import { ReviewService } from '../services/review.service';

@Injectable({
  providedIn: 'root',
})
export class TablesEngine {
  private randomService = inject(RandomService);

  private questions: TableQuestion[] = [];

  constructor(
    private settingsService: SettingsService,
    private reviewService: ReviewService,
  ) {}

  generate(): Question<TableQuestion> {
    const question = this.nextQuestion();

    return this.createQuestion(question);
  }

  createQuestion(question: TableQuestion): Question<TableQuestion> {
    return {
      question: `${question.table} × ${question.multiplier}`,
      answer: String(question.table * question.multiplier),
      data: question,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  private nextQuestion(): TableQuestion {
    let review = this.reviewService.getNextReviewQuestion<TableQuestion>();

    if (review) {
      return review;
    }

    if (this.questions.length === 0) {
      review = this.reviewService.getNextReviewQuestion<TableQuestion>();

      if (review) {
        return review;
      }

      this.resetQuestions();
    }

    return this.questions.shift()!;
  }

  private resetQuestions(): void {
    const settings = this.settingsService.settings();

    const tables =
      settings.tableSelection === 'random'
        ? Array.from({ length: 19 }, (_, i) => i + 2)
        : settings.selectedTables;

    const multiplierLimit = Number(settings.multiplierLimit);

    const questions: TableQuestion[] = [];

    for (const table of tables) {
      for (let multiplier = 2; multiplier <= multiplierLimit; multiplier++) {
        questions.push({
          table,
          multiplier,
        });
      }
    }

    this.questions = this.randomService.shuffle(questions);
  }

  getTablesReference(): number[] {
    const settings = this.settingsService.settings();

    return settings.tableSelection === 'random'
      ? Array.from({ length: 19 }, (_, i) => i + 2)
      : settings.selectedTables;
  }
}
