import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from '../../core/models/subject.model';
import { subjects } from '../../core/data/subjects';
import { StateService } from '../../core/services/state.service';

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
    private stateService: StateService,
  ) {
    stateService.resetAll();
  }

  openSubject(subject: Subject) {
    this.stateService.setSubject(subject);
    this.router.navigate([subject.route, 'topics']);
  }

  openStatistics() {
    this.router.navigate(['/statistics']);
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }

  openBookmarks() {
    this.router.navigate(['/bookmarks']);
  }
}
