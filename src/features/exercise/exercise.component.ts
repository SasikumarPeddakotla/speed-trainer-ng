import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Exercise } from '../../core/models/exercise.model';
import { exercises } from '../../core/data/exercises';
import { StateService } from '../../core/services/state.service';
import { SessionType } from '../../core/enums/session-type.enum';

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
    private stateService: StateService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const topic = params.get('topic');

      if (!topic) {
        return;
      }

      this.topicName = topic;

      this.exercises = exercises.filter((exercise) => exercise.topic === topic);

      // If there is only one exercise, skip this page
      // if (this.exercises.length === 1) {
      //   this.openExercise(this.exercises[0]);
      // }
    });
  }

  openExercise(exercise: Exercise) {
    if (!exercise.implemented) {
      alert('Coming Soon');
      return;
    }

    // this.stateService.setSessionType(SessionType.Practice);
    // this.stateService.setQuestionTarget(10);
    // this.stateService.setWordsLimit('10');

    this.stateService.setExercise(exercise);
    this.stateService.setReferenceView('all');
    this.router.navigate([exercise?.route, 'reference']);
  }
}
