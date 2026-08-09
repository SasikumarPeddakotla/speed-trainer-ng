import { Injectable, signal } from '@angular/core';

import { Settings } from '../models/settings.model';
import { SessionType } from '../enums/session-type.enum';
import { Exercise } from '../models/exercise.model';
import { Subject } from '../models/subject.model';
import { Topic } from '../models/topic.model';
import { StorageService } from './storage.service';
import { StorageKeys } from '../enums/storage-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private storageService: StorageService) {
    const saved = this.storageService.get<Settings>(StorageKeys.Settings);

    if (saved) {
      this._settings.set(saved);
    }
  }

  private readonly DEFAULT_SETTINGS: Settings = {
    selectedSubject: null,
    selectedTopic: null,
    selectedExercise: null,

    digitSelection: '1x1',

    tableSelection: 'random',
    selectedTables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    multiplierLimit: '10',

    numberRange: '10',

    sessionType: SessionType.Practice,

    countdownDuration: 60,
    questionTarget: 10,

    wordsLimit: '10',

    referenceView: 'all',
  };

  private readonly _settings = signal<Settings>(this.DEFAULT_SETTINGS);

  readonly settings = this._settings.asReadonly();

  private updateSettings(updater: (settings: Settings) => Settings): void {
    this._settings.update(updater);

    this.storageService.set(StorageKeys.Settings, this._settings());
  }

  setSubject(subject: Subject) {
    this.updateSettings((settings) => ({
      ...settings,
      selectedSubject: subject,
    }));
  }

  setTopic(topic: Topic) {
    this.updateSettings((settings) => ({
      ...settings,
      selectedTopic: topic,
    }));
  }

  setExercise(exercise: Exercise) {
    this.updateSettings((settings) => ({
      ...settings,
      selectedExercise: exercise,
    }));
  }

  setTableSelection(tableSelection: 'random' | 'custom') {
    this.updateSettings((settings) => ({
      ...settings,
      tableSelection: tableSelection,
    }));
  }

  setDigitSelection(digit: string) {
    this.updateSettings((settings) => ({
      ...settings,
      digitSelection: digit,
    }));
  }

  setSessionType(sessionType: SessionType) {
    this.updateSettings((settings) => ({
      ...settings,
      sessionType,
    }));
  }

  setCountdownDuration(seconds: number) {
    this.updateSettings((settings) => ({
      ...settings,
      countdownDuration: seconds,
    }));
  }

  setQuestionTarget(count: number) {
    this.updateSettings((settings) => ({
      ...settings,
      questionTarget: count,
    }));
  }

  setMultiplierLimit(limit: string) {
    this.updateSettings((settings) => ({
      ...settings,
      multiplierLimit: limit,
    }));
  }

  setNumberRange(range: string) {
    this.updateSettings((settings) => ({
      ...settings,
      numberRange: range,
    }));
  }

  setSelectedTables(selectedTables: number[]) {
    this.updateSettings((settings) => ({
      ...settings,
      selectedTables,
    }));
  }

  setWordsLimit(limit: string) {
    this.updateSettings((settings) => ({
      ...settings,
      wordsLimit: limit,
    }));
  }

  setReferenceView(referenceView: 'all' | 'weak' | 'bookmark') {
    this.updateSettings((settings) => ({
      ...settings,
      referenceView,
    }));
  }
}
