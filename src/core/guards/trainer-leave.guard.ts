import { inject } from '@angular/core';
import { CanDeactivateFn, Router } from '@angular/router';

import { TrainerComponent } from '../../features/trainer/trainer.component';
import { DialogService } from '../services/dialog.service';
import { StateService } from '../services/state.service';

export const trainerLeaveGuard: CanDeactivateFn<TrainerComponent> = async (
  component,
) => {
  // Automatic navigation to Summary after session completion.
  if (component.allowNavigation) {
    return true;
  }

  const dialogService = inject(DialogService);
  const router = inject(Router);
  const stateService = inject(StateService);

  const leave = await dialogService.confirmAsync({
    title: 'Leave practice?',
    message:
      'Your current practice session will be ended. Are you sure you want to leave?',
    confirmText: 'Leave',
    cancelText: 'Stay',
  });

  if (!leave) {
    return false;
  }

  const exercise = stateService.navigation().selectedExercise;

  if (!exercise) {
    return router.createUrlTree(['/subjects']);
  }

  return router.createUrlTree([`/${exercise.route}/practice-settings`]);
};
