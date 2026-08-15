import { inject, Injectable } from '@angular/core';

import { StateService } from '../services/state.service';
import { Question } from '../models/question.model';
import { TableQuestion } from '../models/table-question.model';
import { RandomService } from '../../utils/random.service';
import { IdService } from '../../utils/id.service';
import { BookmarkService } from '../services/bookmark.service';

@Injectable({
  providedIn: 'root',
})
export class TablesEngine {
  private randomService = inject(RandomService);

  private questions: TableQuestion[] = [];

  constructor(
    private stateService: StateService,
    private idService: IdService,
    private bookmarkService: BookmarkService,
  ) {}

  generate(): Question<TableQuestion> {
    const question = this.nextQuestion();

    return this.createQuestion(question);
  }

  createQuestion(question: TableQuestion): Question<TableQuestion> {
    return {
      id: this.idService.getQuestionId(
        `${question.table} × ${question.multiplier}`,
      ),
      question: `${question.table} × ${question.multiplier}`,
      answer: String(question.table * question.multiplier),
      data: question,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  private nextQuestion(): TableQuestion {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalTable();
      case 'bookmark':
        return this.nextBookmarkTable();
    }
  }

  private nextNormalTable(): TableQuestion {
    if (this.questions.length === 0) {
      this.resetQuestions();
    }

    return this.questions.shift()!;
  }

  private nextBookmarkTable(): TableQuestion {
    if (this.questions.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<TableQuestion>();
      this.questions = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.questions.shift()!;
  }

  private resetQuestions(): void {
    const settings = this.stateService.practice();

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

  getTablesReference(): TableQuestion[] {
    const tables = Array.from({ length: 19 }, (_, i) => i + 2);
    const multiplierLimit = 20;

    const questions: TableQuestion[] = [];

    for (const table of tables) {
      for (let multiplier = 1; multiplier <= multiplierLimit; multiplier++) {
        questions.push({ table, multiplier });
      }
    }

    return questions;
  }

  reset() {
    this.questions = [];
  }
}
