import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';

import { StateService } from '../../core/services/state.service';

import { AlphabetReferenceComponent } from './alphabet-reference/alphabet-reference.component';
import { VocabularyReferenceComponent } from './vocabulary-reference/vocabulary-reference.component';
import { TablesReferenceComponent } from './tables-reference/tables-reference.component';
import { PowerReferenceComponent } from './power-reference/power-reference.component';
import { ConversionReferenceComponent } from './conversion-reference/conversion-reference.component';
import { PolityReferenceComponent } from './polity-reference/polity-reference.component';
import { Router } from '@angular/router';
import { NotesReferenceComponent } from './notes-reference/notes-reference.component';

interface ReferenceCounts {
  allCount: number;
  bookmarkCount: number;
}

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
    NotesReferenceComponent,
  ],
  templateUrl: './reference.component.html',
  styleUrl: './reference.component.scss',
})
export class ReferenceComponent {
  private stateService = inject(StateService);
  private router = inject(Router);

  counts: ReferenceCounts = {
    allCount: 0,
    bookmarkCount: 0,
  };

  protected readonly referenceTab = computed(
    () => this.stateService.navigation().referenceView,
  );

  protected readonly topic = this.stateService.navigation().selectedTopic;

  protected readonly exercise = this.stateService.navigation().selectedExercise;

  protected readonly searchText = signal('');

  protected readonly showInfo = signal(false);

  toggleInfo(event: MouseEvent): void {
    event.stopPropagation();
    this.showInfo.update((value) => !value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.info-button') && !target.closest('.info-popover')) {
      this.showInfo.set(false);
    }
  }

  showQuestions(referenceView: 'all' | 'bookmark'): void {
    this.stateService.setReferenceView(referenceView);

    // Close information when changing tabs.
    this.showInfo.set(false);
  }

  practice() {
    this.stateService.setReferenceCounts(this.counts);

    this.stateService.resetPractice();
    this.router.navigate([this.exercise?.route, 'practice-settings']);
  }

  onCountChange(counts: ReferenceCounts) {
    this.counts = counts;
  }
}
