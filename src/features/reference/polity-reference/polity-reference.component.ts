import { Component, inject } from '@angular/core';

import { PolityEngine } from '../../../core/engines/polity.engine';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-polity-reference',
  imports: [],
  templateUrl: './polity-reference.component.html',
  styleUrl: './polity-reference.component.scss',
})
export class PolityReferenceComponent {
  private polityEngine = inject(PolityEngine);

  protected readonly articles: Article[] =
    this.polityEngine.getArticlesReference();
}
