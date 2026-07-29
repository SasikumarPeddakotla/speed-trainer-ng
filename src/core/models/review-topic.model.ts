import { Exercise } from './exercise.model';

export interface ReviewTopic {
  title: string;
  total: number;
  exercises: {
    exercise: Exercise;
    count: number;
  }[];
}
