import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

import { PowerEngine } from '../../../core/engines/power.engine';
import { StateService } from '../../../core/services/state.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { BookmarkService } from '../../../core/services/bookmark.service';

import { Square } from '../../../core/models/square.model';
import { Cube } from '../../../core/models/cube.model';
import { SquareRoot } from '../../../core/models/square-root.model';
import { CubeRoot } from '../../../core/models/cube-root.model';

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

  referenceTab = input<'all' | 'bookmark'>();
  count = output<{
    allCount: number;
    bookmarkCount: number;
  }>();

  public PracticeMode = PracticeMode;

  protected readonly mode = this.stateService.navigation().selectedExercise
    ?.mode as PracticeMode;

  private readonly allQuestions = computed(() => {
    switch (this.mode) {
      case PracticeMode.Squares:
        return this.powerEngine.getSquaresReference();

      case PracticeMode.Cubes:
        return this.powerEngine.getCubesReference();

      case PracticeMode.SquareRoots:
        return this.powerEngine.getSquareRootsReference();

      case PracticeMode.CubeRoots:
        return this.powerEngine.getCubeRootsReference();

      default:
        return [];
    }
  });

  private readonly bookmarkQuestions = computed(() => {
    switch (this.mode) {
      case PracticeMode.Squares:
        return this.bookmarkService.getBookmarkedQuestions<Square>();

      case PracticeMode.Cubes:
        return this.bookmarkService.getBookmarkedQuestions<Cube>();

      case PracticeMode.SquareRoots:
        return this.bookmarkService.getBookmarkedQuestions<SquareRoot>();

      case PracticeMode.CubeRoots:
        return this.bookmarkService.getBookmarkedQuestions<CubeRoot>();

      default:
        return [];
    }
  });

  // To return the counts to parent
  private readonly emitCountsEffect = effect(() => {
    this.count.emit({
      allCount: this.allQuestions().length,
      bookmarkCount: this.bookmarkQuestions().length,
    });
  });

  readonly questions = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkQuestions();

      default:
        return this.allQuestions();
    }
  });

  readonly squares = computed(() => {
    return this.questions() as Square[];
  });

  readonly cubes = computed(() => {
    return this.questions() as Cube[];
  });

  readonly squareRoots = computed(() => {
    return this.questions() as SquareRoot[];
  });

  readonly cubeRoots = computed(() => {
    return this.questions() as CubeRoot[];
  });

  async toggleBookmark(
    question: Square | Cube | SquareRoot | CubeRoot,
  ): Promise<void> {
    const entry = {
      id: question.id,
      mode: this.mode,
      question,
    };

    await this.bookmarkService.toggle(entry);
  }

  isBookmarked(question: Square | Cube | SquareRoot | CubeRoot): boolean {
    return this.bookmarkService.isBookmarked(question.id);
  }
}
