import { Component, inject } from '@angular/core';

import { AlphabetEngine } from '../../../core/engines/alphabet.engine';

@Component({
  selector: 'app-alphabet-reference',
  standalone: true,
  imports: [],
  templateUrl: './alphabet-reference.component.html',
  styleUrl: './alphabet-reference.component.scss',
})
export class AlphabetReferenceComponent {
  private alphabetEngine = inject(AlphabetEngine);

  protected readonly alphabets = this.alphabetEngine.getAlphabetReference();
}
