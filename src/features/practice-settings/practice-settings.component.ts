import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SettingsService } from '../../core/services/settings.service';
import { SessionType } from '../../core/enums/session-type.enum';
import { SettingType } from '../../core/enums/setting-type.enum';
import { SessionTypeSettingComponent } from './components/session-type-setting/session-type-setting.component';

@Component({
  selector: 'app-practice-settings',
  standalone: true,
  imports: [FormsModule, SessionTypeSettingComponent],
  templateUrl: './practice-settings.component.html',
  styleUrl: './practice-settings.component.scss',
})
export class PracticeSettingsComponent {
  readonly SessionType = SessionType;
  readonly SettingType = SettingType;

  constructor(
    public settingsService: SettingsService,
    private router: Router,
  ) {}

  startPractice() {
    this.router.navigate(['/trainer']);
  }

  setSessionType(type: SessionType) {
    this.settingsService.setSessionType(type);
  }

  hasSetting(setting: SettingType): boolean {
    return (
      this.settingsService
        .settings()
        .selectedExercise?.settings.includes(setting) ?? false
    );
  }
}
