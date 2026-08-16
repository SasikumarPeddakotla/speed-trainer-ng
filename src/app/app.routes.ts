import { Routes } from '@angular/router';

import { HomeComponent } from '../features/home/home.component';
import { PracticeSettingsComponent } from '../features/practice-settings/practice-settings.component';
import { TrainerComponent } from '../features/trainer/trainer.component';
import { SummaryComponent } from '../features/summary/summary.component';
import { StatisticsComponent } from '../features/statistics/statistics.component';
import { AppSettingsComponent } from '../features/app-settings/app-settings.component';
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

  // ---------------------------------------------------------
  // Root
  // ---------------------------------------------------------

  {
    path: 'subjects',
    component: HomeComponent,
  },

  // ---------------------------------------------------------
  // Subject → Topics
  // ---------------------------------------------------------

  {
    path: ':subject/topics',
    component: TopicComponent,
  },

  // ---------------------------------------------------------
  // Topic → Exercises
  // ---------------------------------------------------------

  {
    path: ':topic/exercises',
    component: ExerciseComponent,
  },

  // ---------------------------------------------------------
  // Exercise → Practice Settings
  // ---------------------------------------------------------

  {
    path: ':exercise/practice-settings',
    component: PracticeSettingsComponent,
  },

  // ---------------------------------------------------------
  // Exercise → Trainer
  // ---------------------------------------------------------

  {
    path: ':exercise/trainer',
    component: TrainerComponent,
  },

  // ---------------------------------------------------------
  // Exercise → Reference
  // ---------------------------------------------------------

  {
    path: ':exercise/reference',
    component: ReferenceComponent,
  },

  // ---------------------------------------------------------
  // Independent pages
  // ---------------------------------------------------------

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
    component: AppSettingsComponent,
  },

  // ---------------------------------------------------------
  // Unknown URL
  // ---------------------------------------------------------

  {
    path: '**',
    redirectTo: '/subjects',
  },
];
