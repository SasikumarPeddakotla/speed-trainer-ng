import { Injectable, signal } from '@angular/core';

export interface SnackbarState {
  visible: boolean;
  closing: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  readonly state = signal<SnackbarState>({
    visible: false,
    closing: false,
    message: '',
  });

  private hideTimeout?: ReturnType<typeof setTimeout>;
  private showTimeout?: ReturnType<typeof setTimeout>;

  show(message: string, duration = 2500): void {
    // Clear any existing timers
    this.clearTimers();

    const current = this.state();

    // If a snackbar is already visible, close it first
    if (current.visible) {
      this.state.set({
        ...current,
        closing: true,
      });

      // Wait for the exit animation to finish
      this.showTimeout = setTimeout(() => {
        this.showNewSnackbar(message, duration);
      }, 200);
    } else {
      this.showNewSnackbar(message, duration);
    }
  }

  private showNewSnackbar(message: string, duration: number): void {
    this.state.set({
      visible: true,
      closing: false,
      message,
    });

    this.hideTimeout = setTimeout(() => {
      this.close();
    }, duration);
  }

  private close(): void {
    this.state.update((state) => ({
      ...state,
      closing: true,
    }));

    this.showTimeout = setTimeout(() => {
      this.state.set({
        visible: false,
        closing: false,
        message: '',
      });
    }, 200);
  }

  private clearTimers(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }

    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
  }

  hide(): void {
    this.clearTimers();

    if (!this.state().visible) {
      return;
    }

    this.close();
  }
}
