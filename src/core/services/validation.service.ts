import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  validate(question: Question, answer: string): boolean {
    const normalizedAnswer = answer.trim().toUpperCase();

    if (question.answer.toUpperCase() === normalizedAnswer) {
      return true;
    }

    return (
      question.acceptedAnswers?.some(
        (accepted) => accepted.trim().toUpperCase() === normalizedAnswer,
      ) ?? false
    );
  }
}
