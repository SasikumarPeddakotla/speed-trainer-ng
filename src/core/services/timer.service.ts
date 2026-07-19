import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timerId: ReturnType<typeof setInterval> | null = null;

  private readonly _timeLeft = signal(0);

  private readonly _running = signal(false);

  readonly timeLeft = this._timeLeft.asReadonly();

  readonly running = this._running.asReadonly();

  readonly displayTime = computed(() => {
    const totalSeconds = this._timeLeft();

    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  });

  private readonly _finished = signal(false);

  readonly finished = this._finished.asReadonly();

  start(seconds: number) {
    this.stop();

    this._finished.set(false);

    this._timeLeft.set(seconds);

    this._running.set(true);

    this.timerId = setInterval(() => {
      const remaining = this._timeLeft();

      if (remaining <= 1) {
        this.stop();

        this._timeLeft.set(0);

        this._finished.set(true);

        return;
      }

      this._timeLeft.set(remaining - 1);
    }, 1000);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);

      this.timerId = null;
    }

    this._running.set(false);
  }

  reset() {
    this.stop();

    this._timeLeft.set(0);

    this._finished.set(false);
  }
}
