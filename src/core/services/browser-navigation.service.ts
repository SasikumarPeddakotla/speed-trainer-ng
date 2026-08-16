import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserNavigationService {
  private active = false;
  private restoring = false;

  private backHandler?: () => void;

  activate(onBack: () => void): void {
    this.deactivate();

    this.active = true;
    this.backHandler = onBack;

    // Create one duplicate entry for the current page.
    history.pushState(
      {
        ...(history.state ?? {}),
        browserNavigationGuard: true,
      },
      '',
      window.location.href,
    );

    window.addEventListener('popstate', this.handlePopState);
  }

  deactivate(): void {
    this.active = false;
    this.restoring = false;
    this.backHandler = undefined;

    window.removeEventListener('popstate', this.handlePopState);
  }

  private handlePopState = (): void => {
    // This popstate is caused by history.forward()
    // restoring the guarded page.
    if (this.restoring) {
      this.restoring = false;
      return;
    }

    if (!this.active) {
      return;
    }

    /*
     * Browser Back has moved from:
     *
     *     [current page] [duplicate]
     *                       ↑
     *
     * to:
     *
     *     [current page]
     *          ↑
     *
     * Restore the duplicate entry without creating
     * another history entry.
     */
    this.restoring = true;

    history.forward();

    const callback = this.backHandler;

    // Wait for history.forward() to restore the URL.
    setTimeout(() => {
      if (!this.active) {
        return;
      }

      callback?.();
    }, 0);
  };
}
