import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SettingsService } from '../../core/services/settings.service';
import { SessionType } from '../../core/enums/session-type.enum';
import { SettingType } from '../../core/enums/setting-type.enum';
import { SessionTypeSettingComponent } from './components/session-type-setting/session-type-setting.component';
import { ExerciseSettingsComponent } from './components/exercise-settings/exercise-settings.component';
import { SessionService } from '../../core/services/session.service';
import { TimerService } from '../../core/services/timer.service';

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

  constructor(
    public settingsService: SettingsService,
    private router: Router,
    private sessionService: SessionService,
    private timerService: TimerService,
  ) {}

  startPractice() {
    this.sessionService.reset();
    this.timerService.reset();
    this.router.navigate(['/trainer']);
  }

  hasSetting(setting: SettingType): boolean {
    return (
      this.settingsService
        .settings()
        .selectedExercise?.settings.includes(setting) ?? false
    );
  }

  setCountdownDuration(value: number) {
    this.settingsService.setCountdownDuration(value);
  }

  setQuestionTarget(value: number) {
    this.settingsService.setQuestionTarget(value);
  }
}
