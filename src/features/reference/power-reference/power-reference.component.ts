import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { PowerEngine } from '../../../core/engines/power.engine';
import { StateService } from '../../../core/services/state.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { IdService } from '../../../utils/id.service';

@Component({
  selector: 'app-power-reference',
  imports: [],
  templateUrl: './power-reference.component.html',
  styleUrl: './power-reference.component.scss',
})
export class PowerReferenceComponent {
  private stateService = inject(StateService);
  private powerEngine = inject(PowerEngine);
  private bookmarkService = inject(BookmarkService);
  private idService = inject(IdService);

  referenceTab = input<'all' | 'bookmark'>();
  count = output<{
    allCount: number;
    bookmarkCount: number;
  }>();

  public PracticeMode = PracticeMode;

  protected readonly mode = this.stateService.navigation().selectedExercise
    ?.mode as PracticeMode;

  private readonly allQuestions = this.powerEngine.getNumbersReference();
  private readonly bookmarkQuestions = computed(() => {
    return this.bookmarkService.getBookmarkedQuestions<number>();
  });

  // To return the counts to parent
  private readonly emitCountsEffect = effect(() => {
    this.count.emit({
      allCount: this.allQuestions.length,
      bookmarkCount: this.bookmarkQuestions().length,
    });
  });

  readonly questions = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkService.getBookmarkedQuestions<number>();

      default:
        return this.powerEngine.getNumbersReference();
    }
  });

  async toggleBookmark(number: number): Promise<void> {
    const entry = {
      id: this.getQuestionId(number),
      mode: this.mode,
      question: number,
    };

    await this.bookmarkService.toggle(entry);
  }

  private getQuestionId(number: number): string {
    switch (this.mode) {
      case PracticeMode.Squares:
        return this.idService.getQuestionId(number);

      case PracticeMode.Cubes:
        return this.idService.getQuestionId(number);

      case PracticeMode.SquareRoots:
        return this.idService.getQuestionId(number * number);

      case PracticeMode.CubeRoots:
        return this.idService.getQuestionId(number ** 3);

      default:
        return '';
    }
  }

  isBookmarked(number: number): boolean {
    return this.bookmarkService.isBookmarked(this.getQuestionId(number));
  }
}
