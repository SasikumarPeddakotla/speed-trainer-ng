import { Component, inject } from '@angular/core';

import { ConversionEngine } from '../../../core/engines/conversion.engine';

@Component({
  selector: 'app-conversion-reference',
  imports: [],
  templateUrl: './conversion-reference.component.html',
  styleUrl: './conversion-reference.component.scss',
})
export class ConversionReferenceComponent {
  private conversionEngine = inject(ConversionEngine);

  protected readonly conversions =
    this.conversionEngine.getConversionsReference();
}
