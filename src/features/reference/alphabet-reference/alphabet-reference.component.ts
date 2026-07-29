import { Component, inject } from '@angular/core';

import { AlphabetEngine } from '../../../core/engines/alphabet.engine';
import { Alphabet } from '../../../core/models/alphabet.model';
import { StudyListService } from '../../../core/services/study-list.service';

@Component({
  selector: 'app-alphabet-reference',
  standalone: true,
  imports: [],
  templateUrl: './alphabet-reference.component.html',
  styleUrl: './alphabet-reference.component.scss',
})
export class AlphabetReferenceComponent {
  private alphabetEngine = inject(AlphabetEngine);
  private studyListService = inject(StudyListService);

  protected readonly alphabets =
    this.studyListService.getQuestions<Alphabet>() ??
    this.alphabetEngine.getAlphabetReference();
}
