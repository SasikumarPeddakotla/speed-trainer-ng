import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuestionService } from '../../core/services/question.service';
import { ValidationService } from '../../core/services/validation.service';
import { SessionService } from '../../core/services/session.service';
import { SessionType } from '../../core/enums/session-type.enum';
import { SettingsService } from '../../core/services/settings.service';
import { KeyboardComponent } from '../keyboard/keyboard.component';

@Component({
  selector: 'app-trainer',
  standalone: true,
  imports: [FormsModule, KeyboardComponent],
  templateUrl: './trainer.component.html',
  styleUrl: './trainer.component.scss',
})
export class TrainerComponent implements OnInit {
  answer = '';
  inputState: 'normal' | 'correct' | 'wrong' = 'normal';

  private hadWrongAttempt = false;

  showSettings = false;

  readonly SessionType = SessionType;

  feedback = '';

  constructor(
    public questionService: QuestionService,
    private validationService: ValidationService,
    public sessionService: SessionService,
    public settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.sessionService.reset();

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
      this.feedback = '✔ Correct';

      setTimeout(() => {
        if (this.hadWrongAttempt) {
          this.questionService.scheduleReview(question.data);
        }

        this.hadWrongAttempt = false;

        this.answer = '';
        this.feedback = '';

        this.inputState = 'normal';

        this.questionService.nextQuestion();
      }, 150);
    } else {
      this.hadWrongAttempt = true;
      this.sessionService.wrong();

      this.inputState = 'wrong';
      this.feedback = '✖ Wrong';

      setTimeout(() => {
        this.answer = '';
        this.feedback = '';
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

  backspace() {
    this.answer = this.answer.slice(0, -1);
  }

  onKeyPressed(key: string) {
    const question = this.questionService.currentQuestion();

    if (!question) {
      return;
    }

    this.answer += key;

    if (this.answer.length === question.answer.length) {
      this.submit();
    }
  }
}
