import { Injectable, inject } from '@angular/core';
import { BookmarkEntry } from '../models/bookmark-entry.model';
import { BookmarkService } from '../services/bookmark.service';
import { SettingsService } from '../services/settings.service';
import { AlphabetEngine } from './alphabet.engine';
import { ConversionEngine } from './conversion.engine';
import { PolityEngine } from './polity.engine';
import { PowerEngine } from './power.engine';
import { TablesEngine } from './tables.engine';
import { VocabularyEngine } from './vocabulary.engine';
import { Direction } from '../enums/direction.enum';
import { PracticeMode } from '../enums/practice-mode.enum';
import { Alphabet } from '../models/alphabet.model';
import { Antonym } from '../models/antonym.model';
import { Article } from '../models/article.model';
import { ConversionQuestion } from '../models/conversion-question.model';
import { Idiom } from '../models/idiom.model';
import { OneWord } from '../models/one-word.model';
import { PowerQuestion } from '../models/power-question.model';
import { Question } from '../models/question.model';
import { Synonym } from '../models/synonym.model';
import { TableQuestion } from '../models/table-question.model';
import { RandomService } from '../../utils/random.service';

@Injectable({
  providedIn: 'root',
})
export class BookmarkEngine {
  private bookmarkService = inject(BookmarkService);

  private settingsService = inject(SettingsService);

  private alphabetEngine = inject(AlphabetEngine);
  private tablesEngine = inject(TablesEngine);
  private powerEngine = inject(PowerEngine);
  private conversionEngine = inject(ConversionEngine);
  private vocabularyEngine = inject(VocabularyEngine);
  private polityEngine = inject(PolityEngine);

  private randomService = inject(RandomService);

  private queue: BookmarkEntry[] = [];

  generateQuestion(): Question {
    const bookmark = this.nextQuestion();

    if (!bookmark) {
      throw new Error('No bookmarked questions remaining.');
    }

    const direction = this.settingsService.settings().direction;

    switch (bookmark.mode) {
      case PracticeMode.Tables:
        return this.tablesEngine.createQuestion(
          bookmark.question as TableQuestion,
        );

      case PracticeMode.Squares:
        return this.powerEngine.createSquare(
          bookmark.question as PowerQuestion,
        );

      case PracticeMode.Cubes:
        return this.powerEngine.createCube(bookmark.question as PowerQuestion);

      case PracticeMode.SquareRoots:
        return this.powerEngine.createSquareRoot(
          bookmark.question as PowerQuestion,
        );

      case PracticeMode.CubeRoots:
        return this.powerEngine.createCubeRoot(
          bookmark.question as PowerQuestion,
        );

      case PracticeMode.LetterPosition:
        return direction === Direction.Forward
          ? this.alphabetEngine.createLetterToPosition(
              bookmark.question as Alphabet,
            )
          : this.alphabetEngine.createPositionToLetter(
              bookmark.question as Alphabet,
            );

      case PracticeMode.LetterReversePosition:
        return direction === Direction.Forward
          ? this.alphabetEngine.createLetterToReversePosition(
              bookmark.question as Alphabet,
            )
          : this.alphabetEngine.createReversePositionToLetter(
              bookmark.question as Alphabet,
            );

      case PracticeMode.MirrorLetter:
        return this.alphabetEngine.createMirrorLetter(
          bookmark.question as Alphabet,
        );

      case PracticeMode.FractionDecimal:
        return this.conversionEngine.createConversionQuestion(
          (bookmark.question as ConversionQuestion).conversion,
          'fraction',
          'decimal',
        );

      case PracticeMode.FractionPercentage:
        return this.conversionEngine.createConversionQuestion(
          (bookmark.question as ConversionQuestion).conversion,
          'fraction',
          'percentage',
        );

      case PracticeMode.DecimalPercentage:
        return this.conversionEngine.createConversionQuestion(
          (bookmark.question as ConversionQuestion).conversion,
          'decimal',
          'percentage',
        );

      case PracticeMode.Synonyms:
        return this.vocabularyEngine.createSynonymQuestion(
          bookmark.question as Synonym,
        );

      case PracticeMode.Antonyms:
        return this.vocabularyEngine.createAntonymQuestion(
          bookmark.question as Antonym,
        );

      case PracticeMode.OneWord:
        return this.vocabularyEngine.createOneWordQuestion(
          bookmark.question as OneWord,
        );

      case PracticeMode.Idioms:
        return this.vocabularyEngine.createIdiomQuestion(
          bookmark.question as Idiom,
        );

      case PracticeMode.Articles:
        return this.polityEngine.createArticleQuestion(
          bookmark.question as Article,
        );

      default:
        throw new Error(`Unsupported bookmark mode: ${bookmark.mode}`);
    }
  }

  private nextQuestion(): BookmarkEntry {
    if (this.queue.length === 0) {
      this.queue = this.randomService.shuffle([
        ...this.bookmarkService.getAllBookmarks(),
      ]);
    }

    return this.queue.shift()!;
  }

  reset() {
    this.queue = [];
  }
}
