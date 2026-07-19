import { Component, computed } from '@angular/core';

import { SettingsService } from '../../../../core/services/settings.service';
import { SessionType } from '../../../../core/enums/session-type.enum';
import { SessionTypeSelectorComponent } from '../session-type-selector/session-type-selector.component';

@Component({
  selector: 'app-session-type-setting',
  standalone: true,
  imports: [SessionTypeSelectorComponent],
  templateUrl: './session-type-setting.component.html',
  styleUrl: './session-type-setting.component.scss',
})
export class SessionTypeSettingComponent {
  readonly SessionType = SessionType;

  readonly sessionInfo = {
    [SessionType.Practice]: {
      icon: '📘',
      title: 'Unlimited',
      description:
        'Learn at your own pace. Retry until every answer is correct.',
    },

    [SessionType.Countdown]: {
      icon: '⏱',
      title: 'Countdown',
      description: 'Practice under time pressure. One attempt per question.',
    },

    [SessionType.QuestionChallenge]: {
      icon: '🎯',
      title: 'Challenge',
      description:
        'Complete a fixed number of questions. One attempt per question.',
    },
  };

  readonly selectedSessionInfo = computed(
    () => this.sessionInfo[this.settingsService.settings().sessionType],
  );

  constructor(public settingsService: SettingsService) {}

  onSessionTypeChange(type: SessionType) {
    this.settingsService.setSessionType(type);
  }
}
