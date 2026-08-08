import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  readonly state = signal<ConfirmDialogState>({
    open: false,
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
  });

  openConfirm(options: Omit<ConfirmDialogState, 'open'>): void {
    this.state.set({
      ...options,
      open: true,
    });
  }

  close(): void {
    this.state.update((s) => ({
      ...s,
      open: false,
    }));
  }

  confirm(): void {
    const callback = this.state().onConfirm;

    this.close();

    callback?.();
  }
}
