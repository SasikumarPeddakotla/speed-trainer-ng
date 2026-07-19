import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../../core/services/session.service';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  constructor(
    public sessionService: SessionService,
    private settingsService: SettingsService,
    private router: Router,
  ) {}

  practiceAgain() {
    const exercise = this.settingsService.settings().selectedExercise;

    if (!exercise) {
      this.router.navigate(['/subjects']);
      return;
    }

    this.router.navigate([`/${exercise.route}/practice-settings`]);
  }

  goHome() {
    this.router.navigate(['/subjects']);
  }
}
