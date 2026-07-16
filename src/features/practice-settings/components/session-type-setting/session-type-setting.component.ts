import { Component } from '@angular/core';

import { SettingsService } from '../../../../core/services/settings.service';
import { SessionType } from '../../../../core/enums/session-type.enum';

@Component({
  selector: 'app-session-type-setting',
  standalone: true,
  imports: [],
  templateUrl: './session-type-setting.component.html',
  styleUrl: './session-type-setting.component.scss',
})
export class SessionTypeSettingComponent {
  readonly SessionType = SessionType;

  constructor(public settingsService: SettingsService) {}

  setSessionType(type: SessionType) {
    this.settingsService.setSessionType(type);
  }
}
