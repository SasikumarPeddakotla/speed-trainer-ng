import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Exercise } from '../../core/models/exercise.model';
import { exercises } from '../../core/data/exercises';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss',
})
export class ExerciseComponent {
  topicName = '';

  exercises: Exercise[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const topic = params.get('topic');

      if (!topic) {
        return;
      }

      this.topicName = topic;

      this.exercises = exercises.filter((exercise) => exercise.topic === topic);
    });
  }

  openExercise(exercise: Exercise) {
    if (!exercise.implemented) {
      alert('Coming Soon');
      return;
    }

    this.settingsService.setExercise(exercise);

    this.router.navigate([exercise.route, 'practice-settings']);
  }
}
