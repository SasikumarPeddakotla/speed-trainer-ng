import { Question } from './question.model';

export interface ReviewItem {
  question: Question;
  delay: number;
}
