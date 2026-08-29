import { inject, Injectable } from '@angular/core';

import { StateService } from '../services/state.service';
import { Question } from '../models/question.model';
import { TableQuestion } from '../models/table-question.model';
import { RandomService } from '../../utils/random.service';
import { BookmarkService } from '../services/bookmark.service';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root',
})
export class TablesEngine {
  private randomService = inject(RandomService);

  private questions: TableQuestion[] = [];

  constructor(
    private stateService: StateService,
    private bookmarkService: BookmarkService,
    private dataService: DataService,
  ) {}

  generate(): Question<TableQuestion> {
    const question = this.nextQuestion();

    return this.createQuestion(question);
  }

  createQuestion(question: TableQuestion): Question<TableQuestion> {
    return {
      id: question.id,
      question: question.expression,
      answer: String(question.result),
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

    const allTables = this.dataService.getTables();

    const questions = allTables.filter((question) => {
      const [tableString, multiplierString] = question.expression.split('×');
      const table = Number(tableString);
      const multiplier = Number(multiplierString);
      return (
        tables.includes(table) &&
        multiplier >= 2 &&
        multiplier <= multiplierLimit
      );
    });

    this.questions = this.randomService.shuffle(questions);
  }

  getTablesReference(): TableQuestion[] {
    return this.dataService.getTables();
  }

  reset(): void {
    this.questions = [];
  }
}
