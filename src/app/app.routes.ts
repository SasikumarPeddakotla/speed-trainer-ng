import { Routes } from '@angular/router';

import { HomeComponent } from '../features/home/home.component';
import { PracticeSettingsComponent } from '../features/practice-settings/practice-settings.component';
import { TrainerComponent } from '../features/trainer/trainer.component';
import { SummaryComponent } from '../features/summary/summary.component';
import { StatisticsComponent } from '../features/statistics/statistics.component';
import { SettingsComponent } from '../features/settings/settings.component';
import { TopicComponent } from '../features/topic/topic.component';
import { ExerciseComponent } from '../features/exercise/exercise.component';
import { ReferenceComponent } from '../features/reference/reference.component';
import { BookmarksComponent } from '../features/bookmarks/bookmarks.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/subjects',
    pathMatch: 'full',
  },
  {
    path: 'subjects',
    component: HomeComponent,
  },
  {
    path: ':subject/topics',
    component: TopicComponent,
  },
  {
    path: ':topic/exercises',
    component: ExerciseComponent,
  },
  {
    path: ':exercise/practice-settings',
    component: PracticeSettingsComponent,
  },
  {
    path: ':exercise/trainer',
    component: TrainerComponent,
  },
  {
    path: ':exercise/reference',
    component: ReferenceComponent,
  },
  {
    path: 'bookmarks',
    component: BookmarksComponent,
  },
  {
    path: 'summary',
    component: SummaryComponent,
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
