import { InputType } from './input-type.type';

export interface Question<T = unknown> {
  question: string;

  answer: string;

  data?: T;

  acceptedAnswers?: string[];

  inputType: InputType;

  options?: string[];

  displayType: 'symbol' | 'text';

  explanation?: string;
}
