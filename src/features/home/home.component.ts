import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from '../../core/models/subject.model';
import { subjects } from '../../core/data/subjects';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly subjects = subjects;

  constructor(
    private router: Router,
    private settingsService: SettingsService,
  ) {}

  openSubject(subject: Subject) {
    this.settingsService.setSubject(subject);
    this.router.navigate([subject.route, 'topics']);
  }

  openStatistics() {
    this.router.navigate(['/statistics']);
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }

  openWeakAreas() {
    this.router.navigate(['/weak-areas']);
  }
}
