import { inject } from '@angular/core';
import { CanDeactivateFn, Router } from '@angular/router';

import { SummaryComponent } from '../../features/summary/summary.component';
import { StateService } from '../services/state.service';

export const summaryLeaveGuard: CanDeactivateFn<SummaryComponent> = (
  component,
) => {
  if (component.allowNavigation) {
    return true;
  }

  const router = inject(Router);
  const stateService = inject(StateService);

  const exercise = stateService.navigation().selectedExercise;

  if (!exercise) {
    return router.createUrlTree(['/subjects']);
  }

  return router.createUrlTree([`/${exercise.route}/practice-settings`]);
};
