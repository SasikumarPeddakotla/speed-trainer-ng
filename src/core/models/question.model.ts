export interface Question {
  question: string;

  answer: string;

  inputType: 'number' | 'text';

  displayType: 'symbol' | 'text';
}
