import { Component, inject, input } from '@angular/core';

import { ConversionEngine } from '../../../core/engines/conversion.engine';
import { FractionConversion } from '../../../core/models/fraction-conversion.model';
import { SettingsService } from '../../../core/services/settings.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { Alphabet } from '../../../core/models/alphabet.model';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-conversion-reference',
  imports: [],
  templateUrl: './conversion-reference.component.html',
  styleUrl: './conversion-reference.component.scss',
})
export class ConversionReferenceComponent {
  private conversionEngine = inject(ConversionEngine);
  private settingsService = inject(SettingsService);
  private reviewService = inject(ReviewService);

  isWeakMode = input<boolean>();

  protected readonly mode = this.settingsService.settings().selectedExercise
    ?.mode as PracticeMode;

  get conversions(): FractionConversion[] {
    if (this.isWeakMode()) {
      return this.reviewService.getPendingQuestions<FractionConversion>(
        this.mode,
      );
    }

    return this.conversionEngine.getConversionsReference();
  }
}
