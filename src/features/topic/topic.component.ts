import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Topic } from '../../core/models/topic.model';
import { topics } from '../../core/data/topics';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.scss',
})
export class TopicComponent {
  subjectName = '';

  topics: Topic[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const subject = params.get('subject');

      if (!subject) {
        return;
      }

      this.subjectName = subject;

      this.topics = topics.filter((topic) => topic.subject === subject);
    });
  }

  openTopic(topic: Topic) {
    if (!topic.implemented) {
      alert('Coming Soon');
      return;
    }

    this.settingsService.setTopic(topic);
    this.router.navigate([topic.route, 'exercises']);
  }
}
