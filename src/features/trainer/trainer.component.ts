import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuestionService } from '../../core/services/question.service';
import { ValidationService } from '../../core/services/validation.service';
import { SessionService } from '../../core/services/session.service';
import { SessionType } from '../../core/enums/session-type.enum';
import { StateService } from '../../core/services/state.service';
import { KeyboardComponent } from '../keyboard/keyboard.component';
import { TimerService } from '../../core/services/timer.service';
import { Router } from '@angular/router';
import { BookmarkService } from '../../core/services/bookmark.service';
import { DialogService } from '../../core/services/dialog.service';
import { PracticeMode } from '../../core/enums/practice-mode.enum';
import { InputType } from '../../core/enums/input-type.enum';
import { SoundService } from '../../core/services/sound.service';

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

  countdownValue: number | null = null;

  showOptions: boolean = false;

  readonly InputType = InputType;

  public stateService = inject(StateService);

  toggleShowOptions(): void {
    this.showOptions = !this.showOptions;
    this.focusTextInput();
  }

  get mode() {
    const bookmark = this.bookmarkService.getCurrentBookmark();

    if (bookmark) {
      return bookmark.mode;
    }

    return this.stateService.navigation().selectedExercise!.mode;
  }

  get referenceView() {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return 'All';

      case 'bookmark':
        return 'Bookmarks';
    }
  }

  protected readonly topic = this.stateService.navigation().selectedTopic;

  protected readonly exercise = this.stateService.navigation().selectedExercise;

  @ViewChild('textInput')
  textInput?: ElementRef<HTMLInputElement>;

  constructor(
    public questionService: QuestionService,
    private validationService: ValidationService,
    public sessionService: SessionService,
    public timerService: TimerService,
    private router: Router,
    private bookmarkService: BookmarkService,
    private dialogService: DialogService,
    private soundService: SoundService,
  ) {
    // Countdown session finished
    effect(() => {
      if (this.stateService.practice().sessionType !== SessionType.Countdown) {
        return;
      }

      if (this.timerService.finished()) {
        this.sessionService.finish();
      }
    });

    // Question challenge finished
    effect(() => {
      if (this.questionService.temporaryPractice()) {
        return;
      }

      if (
        this.stateService.practice().sessionType !==
        SessionType.QuestionChallenge
      ) {
        return;
      }

      if (
        this.sessionService.totalQuestions() >=
        this.stateService.practice().questionTarget
      ) {
        this.sessionService.finish();
      }
    });

    // Navigate to summary
    effect(() => {
      if (this.sessionService.finished()) {
        setTimeout(() => {
          this.router.navigate(['/summary']);
        }, 200);
      }
    });
  }

  ngOnInit(): void {
    this.questionService.resetAllEngines();

    this.showNextQuestion();

    if (this.stateService.practice().sessionType === SessionType.Countdown) {
      this.startCountdown();
    } else {
      this.startPractice();
    }
  }

  private startPractice(): void {
    if (this.stateService.practice().sessionType === SessionType.Countdown) {
      this.timerService.start(this.stateService.practice().countdownDuration);
    }

    this.focusTextInput();
  }

  private startCountdown(): void {
    this.countdownValue = 3;

    const interval = setInterval(() => {
      if (this.countdownValue! > 1) {
        this.countdownValue!--;
        return;
      }

      clearInterval(interval);

      this.countdownValue = 0;

      setTimeout(() => {
        this.countdownValue = null;
        this.startPractice();
      }, 500);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.timerService.stop();
  }

  // --------------------------------------------------
  // Question flow
  // --------------------------------------------------

  /**
   * Gets the next question for the trainer.
   *
   * If an eligible temporary review question exists,
   * it is shown first. Otherwise a new question is
   * generated normally.
   */
  private showNextQuestion(): void {
    // ------------------------------------------
    // Practice Mistakes
    // ------------------------------------------

    if (this.questionService.temporaryPractice()) {
      const question = this.questionService.getNextTemporaryQuestion();

      if (!question) {
        this.sessionService.finish();
        return;
      }

      this.questionService.setQuestion(question);
      return;
    }

    // ------------------------------------------
    // Normal practice
    // ------------------------------------------

    if (!this.allowsReviewQuestions()) {
      this.questionService.nextQuestion();
      return;
    }

    const reviewQuestion = this.sessionService.getNextReviewQuestion();

    if (reviewQuestion) {
      this.questionService.setQuestion(reviewQuestion);
      return;
    }

    this.questionService.nextQuestion();
  }

  private allowsReviewQuestions(): boolean {
    // Complete Set must contain only the questions
    // from the selected reference set. Review questions
    // must never interrupt it.
    return this.stateService.practice().questionSelection !== 'completeSet';
  }

  // --------------------------------------------------
  // Answer submission
  // --------------------------------------------------

  submit(): void {
    const question = this.questionService.currentQuestion();

    if (!question) {
      return;
    }

    const userAnswer = this.answer;

    const correct = this.validationService.validate(question, userAnswer);

    // Record every attempt in the current session.
    this.sessionService.recordAttempt(question, userAnswer, correct);

    if (correct) {
      this.sessionService.correct();
      this.soundService.playCorrect();

      this.inputState = 'correct';

      setTimeout(() => {
        this.answer = '';

        this.inputState = 'normal';
        this.selectedOption = null;

        this.showNextQuestion();
        this.focusTextInput();

        if (
          !this.questionService.temporaryPractice() &&
          this.allowsReviewQuestions()
        ) {
          this.sessionService.advanceReviewDelays();
        }
      }, 200);

      return;
    }

    // Wrong answer
    this.sessionService.wrong();
    this.soundService.playWrong();

    if (!this.questionService.temporaryPractice()) {
      this.sessionService.addToReviewQueue(question);
    }

    this.inputState = 'wrong';

    setTimeout(() => {
      this.answer = '';

      this.inputState = 'normal';
      this.selectedOption = null;

      // Practice mode keeps the current question visible
      // after a wrong answer.
      if (this.stateService.practice().sessionType !== SessionType.Practice) {
        this.showNextQuestion();
        this.focusTextInput();

        if (
          !this.questionService.temporaryPractice() &&
          this.allowsReviewQuestions()
        ) {
          this.sessionService.advanceReviewDelays();
        }
      }
    }, 200);
  }

  // --------------------------------------------------
  // Settings
  // --------------------------------------------------

  openSettings(): void {
    this.showSettings = true;
  }

  closeSettings(): void {
    this.showSettings = false;
  }

  // --------------------------------------------------
  // Keyboard
  // --------------------------------------------------

  backspace(): void {
    this.answer = this.answer.slice(0, -1);
  }

  onKeyPressed(key: string): void {
    const question = this.questionService.currentQuestion();

    if (!question) {
      return;
    }

    this.answer += key;

    if (this.answer.length === question.answer.length) {
      this.submit();
    }
  }

  onTextChanged(): void {
    const question = this.questionService.currentQuestion();

    if (!question) {
      return;
    }

    if (this.answer.length === question.answer.length) {
      this.submit();
    }
  }

  checkAnswer(): void {
    this.submit();
  }

  private focusTextInput(): void {
    setTimeout(() => {
      this.textInput?.nativeElement.focus();
    });
  }

  // --------------------------------------------------
  // Reveal answer
  // --------------------------------------------------

  revealAnswer(): void {
    const question = this.questionService.currentQuestion();

    if (!question) {
      return;
    }

    this.revealedAnswer = question.answer;

    // Treat revealing the answer as a wrong attempt.
    this.sessionService.recordAttempt(question, '', false);

    this.sessionService.wrong();

    this.sessionService.addToReviewQueue(question);
  }

  understood(): void {
    this.revealedAnswer = null;
    this.answer = '';
    this.inputState = 'normal';

    this.showNextQuestion();
    this.focusTextInput();
  }

  // --------------------------------------------------
  // Multiple choice
  // --------------------------------------------------

  selectOption(option: string): void {
    if (this.selectedOption !== null) {
      return;
    }

    this.selectedOption = option;
    this.answer = option;

    this.submit();
  }

  // --------------------------------------------------
  // Display
  // --------------------------------------------------

  get questionFontSize(): string {
    const question = this.questionService.currentQuestion();

    if (!question) {
      return '42px';
    }

    if (question.displayType === 'symbol') {
      return '72px';
    }

    const length = question.question.length;

    const size = Math.max(22, 35 - (length - 10) * 0.5);

    return `${size}px`;
  }

  get revealedAnswerFontSize(): string {
    const revealedAnswer = this.questionService.currentQuestion()?.answer;

    if (!revealedAnswer) {
      return '30px';
    }

    const length = revealedAnswer.length;

    const size = Math.max(16, 30 - length * 0.8);

    return `${size}px`;
  }

  // --------------------------------------------------
  // Bookmarks
  // --------------------------------------------------

  toggleBookmark(): void {
    const question = this.questionService.currentQuestion();

    if (!question?.data) {
      return;
    }

    const bookmark = this.bookmarkService.getCurrentBookmark();

    if (bookmark) {
      // Bookmark practice
      this.bookmarkService.toggle(bookmark);
    } else {
      // Normal practice
      this.bookmarkService.toggle({
        id: question.id,
        mode: this.mode,
        question: question.data,
      });
    }
  }

  isBookmarked(): boolean {
    const question = this.questionService.currentQuestion();

    if (!question) {
      return false;
    }

    return this.bookmarkService.isBookmarked(question.id);
  }

  endSession(): void {
    this.dialogService.openConfirm({
      title: 'End session',
      message: 'Are you sure you want to end this session?',
      confirmText: 'End Session',
      cancelText: 'Cancel',
      onConfirm: () => {
        this.timerService.stop();
        this.sessionService.finish();
      },
    });
  }
}
