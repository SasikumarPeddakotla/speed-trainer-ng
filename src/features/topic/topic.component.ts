import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Topic } from '../../core/models/topic.model';
import { topics } from '../../core/data/topics';

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

    this.router.navigate([topic.route, 'exercises']);
  }
}
