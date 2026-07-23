import {
  Component,
  effect,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuestionService } from '../../core/services/question.service';
import { ValidationService } from '../../core/services/validation.service';
import { SessionService } from '../../core/services/session.service';
import { SessionType } from '../../core/enums/session-type.enum';
import { SettingsService } from '../../core/services/settings.service';
import { KeyboardComponent } from '../keyboard/keyboard.component';
import { TimerService } from '../../core/services/timer.service';
import { Router } from '@angular/router';
import { ArticleQuestionData } from '../../core/models/article-question-data.model';

@Component({
  selector: 'app-trainer',
  standalone: true,
  imports: [FormsModule, KeyboardComponent],
  templateUrl: './trainer.component.html',
  styleUrl: './trainer.component.scss',
})
export class TrainerComponent implements OnInit, OnDestroy {
  answer = '';
  inputState: 'normal' | 'correct' | 'wrong' = 'normal';

  showSettings = false;

  readonly SessionType = SessionType;

  revealedAnswer: string | null = null;

  selectedOption: string | null = null;

  @ViewChild('textInput')
  textInput?: ElementRef<HTMLInputElement>;

  constructor(
    public questionService: QuestionService,
    private validationService: ValidationService,
    public sessionService: SessionService,
    public settingsService: SettingsService,
    public timerService: TimerService,
    private router: Router,
  ) {
    effect(() => {
      if (
        this.settingsService.settings().sessionType !== SessionType.Countdown
      ) {
        return;
      }

      if (this.timerService.finished()) {
        this.sessionService.finish();
      }
    });

    effect(() => {
      if (
        this.settingsService.settings().sessionType !==
        SessionType.QuestionChallenge
      ) {
        return;
      }

      if (
        this.sessionService.totalQuestions() >=
        this.settingsService.settings().questionTarget
      ) {
        this.sessionService.finish();
      }
    });

    effect(() => {
      if (this.sessionService.finished()) {
        this.router.navigate(['/summary']);
      }
    });
  }

  ngOnInit(): void {
    if (this.settingsService.settings().sessionType === SessionType.Countdown) {
      this.timerService.start(
        this.settingsService.settings().countdownDuration,
      );
    }
    this.questionService.nextQuestion();
    this.focusTextInput();
  }

  ngOnDestroy(): void {
    this.timerService.stop();
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
        this.answer = '';

        this.inputState = 'normal';
        this.selectedOption = null;

        this.questionService.nextQuestion();
        this.focusTextInput();
      }, 150);
    } else {
      this.sessionService.wrong();

      this.inputState = 'wrong';

      setTimeout(() => {
        this.answer = '';
        this.inputState = 'normal';
        this.selectedOption = null;
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

  onTextChanged() {
    const question = this.questionService.currentQuestion();

    if (!question) {
      return;
    }

    if (this.answer.length === question.answer.length) {
      this.submit();
    }
  }

  private focusTextInput() {
    setTimeout(() => {
      this.textInput?.nativeElement.focus();
    });
  }

  revealAnswer() {
    const question = this.questionService.currentQuestion();

    if (!question) {
      return;
    }

    this.revealedAnswer = question.answer;
  }

  understood() {
    this.revealedAnswer = null;
    this.answer = '';
    this.inputState = 'normal';

    this.questionService.nextQuestion();
    this.focusTextInput();
  }

  selectOption(option: string): void {
    if (this.selectedOption !== null) {
      return;
    }

    this.selectedOption = option;
    this.answer = option;
    this.submit();
  }

  // get articleOptions(): string[] {
  //   const question = this.questionService.currentQuestion();
  //   if (!question) {
  //     return [];
  //   }
  //   if (question.inputType !== 'multiple-choice') {
  //     return [];
  //   }

  //   return question.options as string[];
  // }

  get questionFontSize(): string {
    const question = this.questionService.currentQuestion();

    if (!question) {
      return '42px';
    }

    if (question.displayType === 'symbol') {
      return '72px';
    }

    const length = question.question.length;

    const size = Math.max(22, 46 - (length - 10) * 0.5);

    return `${size}px`;
  }
}
