import { Component, inject, signal } from '@angular/core';

import { SettingsService } from '../../core/services/settings.service';

import { AlphabetReferenceComponent } from './alphabet-reference/alphabet-reference.component';
import { VocabularyReferenceComponent } from './vocabulary-reference/vocabulary-reference.component';
import { TablesReferenceComponent } from './tables-reference/tables-reference.component';
import { PowerReferenceComponent } from './power-reference/power-reference.component';
import { ConversionReferenceComponent } from './conversion-reference/conversion-reference.component';
import { PolityReferenceComponent } from './polity-reference/polity-reference.component';

@Component({
  selector: 'app-reference',
  standalone: true,
  imports: [
    AlphabetReferenceComponent,
    VocabularyReferenceComponent,
    TablesReferenceComponent,
    PowerReferenceComponent,
    ConversionReferenceComponent,
    PolityReferenceComponent,
  ],
  templateUrl: './reference.component.html',
  styleUrl: './reference.component.scss',
})
export class ReferenceComponent {
  private settingsService = inject(SettingsService);

  protected readonly topic = this.settingsService.settings().selectedTopic;

  protected readonly exercise =
    this.settingsService.settings().selectedExercise;

  protected readonly searchText = signal('');
}
