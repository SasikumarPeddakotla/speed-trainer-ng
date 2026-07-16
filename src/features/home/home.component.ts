import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from '../../core/models/subject.model';
import { subjects } from '../../core/data/subjects';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly subjects = subjects;

  constructor(private router: Router) {}

  openSubject(subject: Subject) {
    this.router.navigate([subject.route, 'topics']);
  }

  openStatistics() {
    this.router.navigate(['/statistics']);
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }
}
