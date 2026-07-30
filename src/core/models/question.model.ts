import { InputType } from './input-type.type';

export interface Question<T = unknown> {
  id: string;

  question: string;

  answer: string;

  data?: T;

  acceptedAnswers?: string[];

  inputType: InputType;

  options?: string[];

  displayType: 'symbol' | 'text';

  explanation?: string;
}
