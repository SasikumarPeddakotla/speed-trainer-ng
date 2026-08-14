import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../../core/services/session.service';
import { StateService } from '../../core/services/state.service';

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
    private stateService: StateService,
    private router: Router,
  ) {}

  practiceAgain() {
    const exercise = this.stateService.navigation().selectedExercise;

    if (!exercise) {
      this.router.navigate(['/subjects']);
      return;
    }

    if (exercise.route === 'bookmarks') {
      this.router.navigate([exercise.route, 'trainer']);
    }

    this.router.navigate([`/${exercise.route}/practice-settings`]);
  }

  goHome() {
    this.router.navigate(['/subjects']);
  }
}
