import { InputType } from './input-type.type';

export interface Question<T = unknown> {
  question: string;

  answer: string;

  data: T;

  acceptedAnswers?: string[];

  inputType: InputType;

  displayType: 'symbol' | 'text';
}
