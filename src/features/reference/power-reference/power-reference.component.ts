import { Component, inject, input } from '@angular/core';
import { PowerEngine } from '../../../core/engines/power.engine';
import { SettingsService } from '../../../core/services/settings.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { PowerQuestion } from '../../../core/models/power-question.model';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-power-reference',
  imports: [],
  templateUrl: './power-reference.component.html',
  styleUrl: './power-reference.component.scss',
})
export class PowerReferenceComponent {
  private settingsService = inject(SettingsService);
  private powerEngine = inject(PowerEngine);
  private reviewService = inject(ReviewService);

  isWeakMode = input<boolean>();

  public PracticeMode = PracticeMode;

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  get numbers(): number[] {
    if (this.isWeakMode()) {
      return this.reviewService
        .getPendingQuestions<PowerQuestion>(this.mode)
        .map((q) => q.number);
    }

    return this.powerEngine.getNumbersReference();
  }
}
