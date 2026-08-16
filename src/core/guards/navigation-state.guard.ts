import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { StateService } from '../services/state.service';

export const navigationStateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
) => {
  const stateService = inject(StateService);
  const router = inject(Router);

  const navigation = stateService.navigation();

  /*
   * ---------------------------------------------------------
   * Topic route
   * /:subject/topics
   * ---------------------------------------------------------
   */
  const subject = route.paramMap.get('subject');

  if (subject) {
    const selectedSubject = navigation.selectedSubject;

    if (!selectedSubject || selectedSubject.route !== subject) {
      return router.createUrlTree(['/subjects']);
    }

    return true;
  }

  /*
   * ---------------------------------------------------------
   * Exercise route
   * /:topic/exercises
   * ---------------------------------------------------------
   */
  const topic = route.paramMap.get('topic');

  if (topic) {
    const selectedTopic = navigation.selectedTopic;

    if (!selectedTopic || selectedTopic.route !== topic) {
      return router.createUrlTree(['/subjects']);
    }

    return true;
  }

  /*
   * ---------------------------------------------------------
   * Exercise-dependent routes
   *
   * /:exercise/reference
   * /:exercise/practice-settings
   * /:exercise/trainer
   * ---------------------------------------------------------
   */
  const exercise = route.paramMap.get('exercise');

  if (exercise) {
    const selectedExercise = navigation.selectedExercise;

    if (!selectedExercise || selectedExercise.route !== exercise) {
      return router.createUrlTree(['/subjects']);
    }

    return true;
  }

  /*
   * Should never normally reach here.
   */
  return router.createUrlTree(['/subjects']);
};
