import { Injectable, signal } from '@angular/core';

import { SessionType } from '../enums/session-type.enum';
import { Exercise } from '../models/exercise.model';
import { Subject } from '../models/subject.model';
import { Topic } from '../models/topic.model';

type ReferenceView = 'all' | 'weak' | 'bookmark';

interface NavigationState {
  selectedSubject: Subject | null;
  selectedTopic: Topic | null;
  selectedExercise: Exercise | null;
  referenceView: ReferenceView;
}

interface PracticeState {
  digitSelection: string;

  tableSelection: 'random' | 'custom';
  selectedTables: number[];
  multiplierLimit: string;

  numberRange: string;

  sessionType: SessionType;
  countdownDuration: number;
  questionTarget: number;

  wordsLimit: string;

  denominatorSelection: 'all' | 'custom';
  selectedDenominators: string[];
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // =========================================================
  // Navigation state
  // =========================================================

  private readonly _navigation = signal<NavigationState>({
    selectedSubject: null,
    selectedTopic: null,
    selectedExercise: null,
    referenceView: 'all',
  });

  readonly navigation = this._navigation.asReadonly();

  // =========================================================
  // Practice state
  // =========================================================

  private readonly _practice = signal<PracticeState>({
    digitSelection: '1x1',

    tableSelection: 'random',
    selectedTables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    multiplierLimit: '10',

    numberRange: '10',

    sessionType: SessionType.Practice,

    countdownDuration: 60,
    questionTarget: 10,

    wordsLimit: '10',

    denominatorSelection: 'all',
    selectedDenominators: [
      '/2',
      '/3',
      '/4',
      '/5',
      '/6',
      '/7',
      '/8',
      '/9',
      '/10',
    ],
  });

  readonly practice = this._practice.asReadonly();

  // =========================================================
  // Navigation helpers
  // =========================================================

  private updateNavigation(
    updater: (state: NavigationState) => NavigationState,
  ): void {
    this._navigation.update(updater);
  }

  setSubject(subject: Subject): void {
    this.updateNavigation((state) => ({
      ...state,
      selectedSubject: subject,
    }));
  }

  setTopic(topic: Topic): void {
    this.updateNavigation((state) => ({
      ...state,
      selectedTopic: topic,
    }));
  }

  setExercise(exercise: Exercise): void {
    this.updateNavigation((state) => ({
      ...state,
      selectedExercise: exercise,
    }));
  }

  setReferenceView(referenceView: ReferenceView): void {
    this.updateNavigation((state) => ({
      ...state,
      referenceView,
    }));
  }

  resetNavigation(): void {
    this._navigation.set({
      selectedSubject: null,
      selectedTopic: null,
      selectedExercise: null,
      referenceView: 'all',
    });
  }

  // =========================================================
  // Practice helpers
  // =========================================================

  private updatePractice(
    updater: (state: PracticeState) => PracticeState,
  ): void {
    this._practice.update(updater);
  }

  setTableSelection(tableSelection: 'random' | 'custom'): void {
    this.updatePractice((state) => ({
      ...state,
      tableSelection,
    }));
  }

  setDigitSelection(digitSelection: string): void {
    this.updatePractice((state) => ({
      ...state,
      digitSelection,
    }));
  }

  setSessionType(sessionType: SessionType): void {
    this.updatePractice((state) => ({
      ...state,
      sessionType,
    }));
  }

  setCountdownDuration(countdownDuration: number): void {
    this.updatePractice((state) => ({
      ...state,
      countdownDuration,
    }));
  }

  setQuestionTarget(questionTarget: number): void {
    this.updatePractice((state) => ({
      ...state,
      questionTarget,
    }));
  }

  setMultiplierLimit(multiplierLimit: string): void {
    this.updatePractice((state) => ({
      ...state,
      multiplierLimit,
    }));
  }

  setNumberRange(numberRange: string): void {
    this.updatePractice((state) => ({
      ...state,
      numberRange,
    }));
  }

  setSelectedTables(selectedTables: number[]): void {
    this.updatePractice((state) => ({
      ...state,
      selectedTables,
    }));
  }

  setWordsLimit(wordsLimit: string): void {
    this.updatePractice((state) => ({
      ...state,
      wordsLimit,
    }));
  }

  setDenominatorSelection(denominatorSelection: 'all' | 'custom'): void {
    this.updatePractice((state) => ({
      ...state,
      denominatorSelection,
    }));
  }

  setSelectedDenominators(selectedDenominators: string[]): void {
    this.updatePractice((state) => ({
      ...state,
      selectedDenominators,
    }));
  }

  resetPractice(): void {
    this._practice.set({
      digitSelection: '1x1',

      tableSelection: 'random',
      selectedTables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      multiplierLimit: '10',

      numberRange: '10',

      sessionType: SessionType.Practice,

      countdownDuration: 60,
      questionTarget: 10,

      wordsLimit: '10',

      denominatorSelection: 'all',
      selectedDenominators: [
        '/2',
        '/3',
        '/4',
        '/5',
        '/6',
        '/7',
        '/8',
        '/9',
        '/10',
      ],
    });
  }

  // =========================================================
  // Full reset
  // =========================================================

  resetAll(): void {
    this.resetNavigation();
    this.resetPractice();
  }
}
