import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuestionService } from '../../core/services/question.service';
import { ValidationService } from '../../core/services/validation.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-trainer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './trainer.component.html',
  styleUrl: './trainer.component.scss',
})
export class TrainerComponent {
  answer = '';
  inputState: 'normal' | 'correct' | 'wrong' = 'normal';

  private hadWrongAttempt = false;

  showSettings = false;

  constructor(
    public questionService: QuestionService,
    private validationService: ValidationService,
    public sessionService: SessionService,
  ) {}

  start() {
    this.sessionService.reset();

    this.answer = '';
    this.hadWrongAttempt = false;

    this.questionService.nextQuestion();
  }

  submit() {
    const question = this.questionService.currentQuestion();

    if (!question) {
      return;
    }

    const correct = this.validationService.validate(question, this.answer);

    if (correct) {
      this.sessionService.correct();

      this.inputState = 'correct';

      setTimeout(() => {
        if (this.hadWrongAttempt) {
          this.questionService.scheduleReview(question.data);
        }

        this.hadWrongAttempt = false;

        this.answer = '';

        this.inputState = 'normal';

        this.questionService.nextQuestion();
      }, 150);
    } else {
      this.hadWrongAttempt = true;
      this.sessionService.wrong();

      this.inputState = 'wrong';

      setTimeout(() => {
        this.inputState = 'normal';
      }, 150);
    }
  }

  openSettings() {
    this.showSettings = true;
  }

  closeSettings() {
    this.showSettings = false;
  }
}
