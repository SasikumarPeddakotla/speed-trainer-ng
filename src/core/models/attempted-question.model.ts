import { Question } from './question.model';

export interface AttemptedQuestion {
  question: Question;
  userAnswer: string;
  correct: boolean;
}
