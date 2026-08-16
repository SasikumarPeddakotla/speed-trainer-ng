import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm?: () => void;
  onCancel?: () => void;
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

  private pendingResolve?: (confirmed: boolean) => void;

  openConfirm(options: Omit<ConfirmDialogState, 'open'>): void {
    this.state.set({
      ...options,
      open: true,
    });
  }

  confirmAsync(options: Omit<ConfirmDialogState, 'open'>): Promise<boolean> {
    return new Promise((resolve) => {
      this.pendingResolve = resolve;

      this.state.set({
        ...options,
        open: true,
      });
    });
  }

  close(): void {
    const current = this.state();

    current.onCancel?.();

    this.state.set({
      open: false,
      title: '',
      message: '',
      confirmText: 'OK',
      cancelText: 'Cancel',
    });

    this.pendingResolve?.(false);
    this.pendingResolve = undefined;
  }

  confirm(): void {
    const callback = this.state().onConfirm;

    this.state.set({
      open: false,
      title: '',
      message: '',
      confirmText: 'OK',
      cancelText: 'Cancel',
    });

    callback?.();

    this.pendingResolve?.(true);
    this.pendingResolve = undefined;
  }
}
