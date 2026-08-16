import { Component, inject } from '@angular/core';

import { BookmarkService } from '../../core/services/bookmark.service';
import { DialogService } from '../../core/services/dialog.service';
import { ThemeService } from '../../core/services/theme.service';
import { Theme } from '../../core/enums/theme.enum';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './app-settings.component.html',
  styleUrl: './app-settings.component.scss',
})
export class AppSettingsComponent {
  private bookmarkService = inject(BookmarkService);
  private dialogService = inject(DialogService);

  readonly themeService = inject(ThemeService);
  readonly Theme = Theme;

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  clearAllBookmarks(): void {
    this.dialogService.openConfirm({
      title: 'Clear bookmarks',
      message: 'Remove all bookmarked questions?',
      confirmText: 'Clear',
      cancelText: 'Cancel',
      onConfirm: () => this.bookmarkService.clearAll(),
    });
  }
}
