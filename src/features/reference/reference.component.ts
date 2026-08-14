import { Component, computed, inject, signal } from '@angular/core';

import { SettingsService } from '../../core/services/settings.service';

import { AlphabetReferenceComponent } from './alphabet-reference/alphabet-reference.component';
import { VocabularyReferenceComponent } from './vocabulary-reference/vocabulary-reference.component';
import { TablesReferenceComponent } from './tables-reference/tables-reference.component';
import { PowerReferenceComponent } from './power-reference/power-reference.component';
import { ConversionReferenceComponent } from './conversion-reference/conversion-reference.component';
import { PolityReferenceComponent } from './polity-reference/polity-reference.component';
import { Router } from '@angular/router';
import { SessionType } from '../../core/enums/session-type.enum';

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
  private router = inject(Router);

  protected readonly referenceTab = computed(
    () => this.settingsService.settings().referenceView,
  );

  protected readonly topic = this.settingsService.settings().selectedTopic;

  protected readonly exercise =
    this.settingsService.settings().selectedExercise;

  protected readonly searchText = signal('');

  showQuestions(referenceView: 'all' | 'weak' | 'bookmark'): void {
    this.settingsService.setReferenceView(referenceView);
  }

  practice() {
    this.settingsService.setSessionType(SessionType.Practice);
    this.settingsService.setQuestionTarget(10);
    this.settingsService.setWordsLimit('10');
    this.router.navigate([this.exercise?.route, 'practice-settings']);
  }
}
