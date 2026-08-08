import { Injectable, signal } from '@angular/core';

export interface SnackbarState {
  visible: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  readonly state = signal<SnackbarState>({
    visible: false,
    message: '',
  });

  show(message: string, duration = 2500): void {
    this.state.set({
      visible: true,
      message,
    });

    setTimeout(() => {
      this.state.set({
        visible: false,
        message: '',
      });
    }, duration);
  }
}
