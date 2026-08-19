import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { StateService } from '../../core/services/state.service';
import { SessionType } from '../../core/enums/session-type.enum';
import { SettingType } from '../../core/enums/setting-type.enum';
import { SessionTypeSettingComponent } from './components/session-type-setting/session-type-setting.component';
import { ExerciseSettingsComponent } from './components/exercise-settings/exercise-settings.component';
import { SessionService } from '../../core/services/session.service';
import { TimerService } from '../../core/services/timer.service';
import { PracticeMode } from '../../core/enums/practice-mode.enum';
import { BookmarkService } from '../../core/services/bookmark.service';
import { DataPreloadService } from '../../core/services/data-preload.service';

@Component({
  selector: 'app-practice-settings',
  standalone: true,
  imports: [
    FormsModule,
    SessionTypeSettingComponent,
    ExerciseSettingsComponent,
  ],
  templateUrl: './practice-settings.component.html',
  styleUrl: './practice-settings.component.scss',
})
export class PracticeSettingsComponent {
  readonly SessionType = SessionType;
  readonly SettingType = SettingType;
  readonly PracticeMode = PracticeMode;

  public stateService = inject(StateService);

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private timerService: TimerService,
    private bookmarkService: BookmarkService,
  ) {}

  get selectedExercise() {
    return this.stateService.navigation().selectedExercise;
  }

  get selectedTopic() {
    return this.stateService.navigation().selectedTopic;
  }

  get referenceView() {
    const referenceView = this.stateService.navigation().referenceView;
    switch (referenceView) {
      case 'all':
        return 'All';
      case 'bookmark':
        return 'Bookmarks';
    }
  }

  get completeSetCount(): number {
    const navigation = this.stateService.navigation();

    switch (navigation.referenceView) {
      case 'bookmark':
        return navigation.referenceCounts.bookmarkCount;

      case 'all':
      default:
        return navigation.referenceCounts.allCount;
    }
  }

  get totalBookmarks() {
    return this.bookmarkService.getTotalBookmarks();
  }

  startPractice() {
    this.sessionService.reset();
    this.timerService.reset();

    const exercise = this.stateService.navigation().selectedExercise;
    this.router.navigate([exercise?.route, 'trainer']);
  }

  openReference() {
    const exercise = this.stateService.navigation().selectedExercise;
    this.stateService.setReferenceView('all');
    this.router.navigate([exercise?.route, 'reference']);
  }

  hasSetting(setting: SettingType): boolean {
    return (
      this.stateService
        .navigation()
        .selectedExercise?.settings.includes(setting) ?? false
    );
  }

  setCountdownDuration(value: number) {
    this.stateService.setCountdownDuration(value);
  }

  setQuestionTarget(value: number | 'completeSet') {
    if (value === 'completeSet') {
      this.stateService.setQuestionSelection('completeSet');
      this.stateService.setQuestionTarget(this.completeSetCount);
    } else {
      this.stateService.setQuestionSelection('fixed');
      this.stateService.setQuestionTarget(value);
    }
  }
}
