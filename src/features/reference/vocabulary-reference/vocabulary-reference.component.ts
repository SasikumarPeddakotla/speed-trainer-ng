import { Component, computed, inject, input } from '@angular/core';

import { SettingsService } from '../../../core/services/settings.service';
import { VocabularyEngine } from '../../../core/engines/vocabulary.engine';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { Synonym } from '../../../core/models/synonym.model';
import { Antonym } from '../../../core/models/antonym.model';
import { OneWord } from '../../../core/models/one-word.model';
import { Idiom } from '../../../core/models/idiom.model';
import { StudyListService } from '../../../core/services/study-list.service';

@Component({
  selector: 'app-vocabulary-reference',
  standalone: true,
  imports: [],
  templateUrl: './vocabulary-reference.component.html',
  styleUrl: './vocabulary-reference.component.scss',
})
export class VocabularyReferenceComponent {
  searchText = input<string>();

  private settingsService = inject(SettingsService);
  private studyListService = inject(StudyListService);

  synonyms: Synonym[] = [];
  antonyms: Antonym[] = [];
  oneWords: OneWord[] = [];
  idioms: Idiom[] = [];

  readonly filteredSynonyms = computed(() => {
    const search = this.searchText()!.trim().toLowerCase();

    // const words = [...this.synonyms].sort((a, b) =>
    //   a.word.localeCompare(b.word),
    // );
    const words = [...this.synonyms];

    if (!search) {
      return words;
    }

    return words.filter(
      (word) =>
        word.word.toLowerCase().includes(search) ||
        word.meaning.toLowerCase().includes(search) ||
        word.synonyms.some((s) => s.toLowerCase().includes(search)),
    );
  });

  readonly filteredAntonyms = computed(() => {
    const search = this.searchText()!.trim().toLowerCase();

    // const words = [...this.antonyms].sort((a, b) =>
    //   a.word.localeCompare(b.word),
    // );
    const words = [...this.antonyms];

    if (!search) {
      return words;
    }

    return words.filter(
      (word) =>
        word.word.toLowerCase().includes(search) ||
        word.meaning.toLowerCase().includes(search) ||
        word.antonyms.some((s) => s.toLowerCase().includes(search)),
    );
  });

  readonly filteredOneWords = computed(() => {
    const search = this.searchText()!.trim().toLowerCase();

    // const words = [...this.oneWords].sort((a, b) =>
    //   a.word.localeCompare(b.word),
    // );
    const words = [...this.oneWords];

    if (!search) {
      return words;
    }

    return words.filter(
      (word) =>
        word.word.toLowerCase().includes(search) ||
        word.phrase.toLowerCase().includes(search),
    );
  });

  readonly filteredIdioms = computed(() => {
    const search = this.searchText()!.trim().toLowerCase();

    // const words = [...this.idioms].sort((a, b) =>
    //   a.idiom.localeCompare(b.idiom),
    // );
    const words = [...this.idioms];

    if (!search) {
      return words;
    }

    return words.filter(
      (word) =>
        word.idiom.toLowerCase().includes(search) ||
        word.meaning.toLowerCase().includes(search),
    );
  });

  constructor(private vocabularyEngine: VocabularyEngine) {
    switch (this.settingsService.settings().selectedExercise?.mode) {
      case PracticeMode.Synonyms:
        this.synonyms =
          this.studyListService.getQuestions<Synonym>() ??
          this.vocabularyEngine.getSynonymsReference();
        break;

      case PracticeMode.Antonyms:
        this.antonyms = this.vocabularyEngine.getAntonymsReference();
        break;

      case PracticeMode.OneWord:
        this.oneWords = this.vocabularyEngine.getOneWordsReference();
        break;

      case PracticeMode.Idioms:
        this.idioms = this.vocabularyEngine.getIdiomsReference();
        break;
    }
  }
}
