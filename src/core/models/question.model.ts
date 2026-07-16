export interface Question<T = unknown> {
  question: string;

  answer: string;

  data: T;

  acceptedAnswers?: string[];

  inputType: 'number' | 'text';

  displayType: 'symbol' | 'text';
}
