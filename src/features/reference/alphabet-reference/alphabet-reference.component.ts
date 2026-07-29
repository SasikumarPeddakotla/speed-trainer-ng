import { Component, inject, input } from '@angular/core';

import { AlphabetEngine } from '../../../core/engines/alphabet.engine';
import { Alphabet } from '../../../core/models/alphabet.model';
import { ReviewService } from '../../../core/services/review.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-alphabet-reference',
  standalone: true,
  imports: [],
  templateUrl: './alphabet-reference.component.html',
  styleUrl: './alphabet-reference.component.scss',
})
export class AlphabetReferenceComponent {
  isWeakMode = input<boolean>();
  private alphabetEngine = inject(AlphabetEngine);
  private reviewService = inject(ReviewService);
  private settingsService = inject(SettingsService);

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  get alphabets(): Alphabet[] {
    if (this.isWeakMode()) {
      return this.reviewService.getPendingQuestions<Alphabet>(this.mode);
    }

    return this.alphabetEngine.getAlphabetReference();
  }
}
