import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SessionType } from '../../../../core/enums/session-type.enum';

@Component({
  selector: 'app-session-type-selector',
  standalone: true,
  imports: [],
  templateUrl: './session-type-selector.component.html',
  styleUrl: './session-type-selector.component.scss',
})
export class SessionTypeSelectorComponent {
  @Input({ required: true })
  selected!: SessionType;

  @Output()
  selectedChange = new EventEmitter<SessionType>();

  readonly SessionType = SessionType;

  readonly options = [
    {
      type: SessionType.Practice,
      label: 'Unlimited',
    },
    {
      type: SessionType.Countdown,
      label: 'Countdown',
    },
    {
      type: SessionType.QuestionChallenge,
      label: 'Challenge',
    },
  ];

  select(type: SessionType) {
    if (this.selected !== type) {
      this.selectedChange.emit(type);
    }
  }
}
