import { Injectable, inject } from '@angular/core';
import { BookmarkEntry } from '../models/bookmark-entry.model';
import { BookmarkService } from '../services/bookmark.service';
import { AlphabetEngine } from './alphabet.engine';
import { ConversionEngine } from './conversion.engine';
import { PolityEngine } from './polity.engine';
import { PowerEngine } from './power.engine';
import { TablesEngine } from './tables.engine';
import { VocabularyEngine } from './vocabulary.engine';
import { PracticeMode } from '../enums/practice-mode.enum';
import { Alphabet } from '../models/alphabet.model';
import { Antonym } from '../models/antonym.model';
import { Article } from '../models/article.model';
import { Idiom } from '../models/idiom.model';
import { OneWord } from '../models/one-word.model';
import { Question } from '../models/question.model';
import { Synonym } from '../models/synonym.model';
import { TableQuestion } from '../models/table-question.model';
import { RandomService } from '../../utils/random.service';
import { FractionConversion } from '../models/fraction-conversion.model';

@Injectable({
  providedIn: 'root',
})
export class BookmarkEngine {
  private bookmarkService = inject(BookmarkService);

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
    this.bookmarkService.setCurrentBookmark(bookmark);

    if (!bookmark) {
      throw new Error('No bookmarked questions remaining.');
    }

    switch (bookmark.mode) {
      case PracticeMode.Tables:
        return this.tablesEngine.createQuestion(
          bookmark.question as TableQuestion,
        );

      case PracticeMode.Squares:
        return this.powerEngine.createSquare(bookmark.question as number);

      case PracticeMode.Cubes:
        return this.powerEngine.createCube(bookmark.question as number);

      case PracticeMode.SquareRoots:
        return this.powerEngine.createSquareRoot(bookmark.question as number);

      case PracticeMode.CubeRoots:
        return this.powerEngine.createCubeRoot(bookmark.question as number);

      case PracticeMode.LetterToPosition:
        return this.alphabetEngine.createLetterToPosition(
          bookmark.question as Alphabet,
        );
      case PracticeMode.PositionToLetter:
        return this.alphabetEngine.createPositionToLetter(
          bookmark.question as Alphabet,
        );

      case PracticeMode.LetterToReversePosition:
        return this.alphabetEngine.createLetterToReversePosition(
          bookmark.question as Alphabet,
        );
      case PracticeMode.ReversePositionToLetter:
        return this.alphabetEngine.createReversePositionToLetter(
          bookmark.question as Alphabet,
        );

      case PracticeMode.MirrorLetter:
        return this.alphabetEngine.createMirrorLetter(
          bookmark.question as Alphabet,
        );

      case PracticeMode.FractionToDecimal:
        return this.conversionEngine.createConversionQuestion(
          bookmark.question as FractionConversion,
          'fraction',
          'decimal',
        );
      case PracticeMode.DecimalToFraction:
        return this.conversionEngine.createConversionQuestion(
          bookmark.question as FractionConversion,
          'decimal',
          'fraction',
        );

      case PracticeMode.FractionToPercentage:
        return this.conversionEngine.createConversionQuestion(
          bookmark.question as FractionConversion,
          'fraction',
          'percentage',
        );
      case PracticeMode.PercentageToFraction:
        return this.conversionEngine.createConversionQuestion(
          bookmark.question as FractionConversion,
          'percentage',
          'fraction',
        );

      case PracticeMode.DecimalToPercentage:
        return this.conversionEngine.createConversionQuestion(
          bookmark.question as FractionConversion,
          'decimal',
          'percentage',
        );
      case PracticeMode.PercentageToDecimal:
        return this.conversionEngine.createConversionQuestion(
          bookmark.question as FractionConversion,
          'percentage',
          'decimal',
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

      case PracticeMode.ArticleToTitle:
        return this.polityEngine.createArticleToTitleQuestion(
          bookmark.question as Article,
        );
      case PracticeMode.TitleToArticle:
        return this.polityEngine.createTitleToArticleQuestion(
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
    this.bookmarkService.setCurrentBookmark(undefined);
  }
}
