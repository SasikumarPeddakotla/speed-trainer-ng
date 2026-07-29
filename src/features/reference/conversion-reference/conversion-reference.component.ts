import { Component, inject } from '@angular/core';

import { ConversionEngine } from '../../../core/engines/conversion.engine';
import { FractionConversion } from '../../../core/models/fraction-conversion.model';
import { StudyListService } from '../../../core/services/study-list.service';

@Component({
  selector: 'app-conversion-reference',
  imports: [],
  templateUrl: './conversion-reference.component.html',
  styleUrl: './conversion-reference.component.scss',
})
export class ConversionReferenceComponent {
  private conversionEngine = inject(ConversionEngine);

  private studyListService = inject(StudyListService);

  protected readonly conversions =
    this.studyListService.getQuestions<FractionConversion>() ??
    this.conversionEngine.getConversionsReference();
}
