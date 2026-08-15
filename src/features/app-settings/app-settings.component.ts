import { Component, inject } from '@angular/core';
import { BookmarkService } from '../../core/services/bookmark.service';
import { DialogService } from '../../core/services/dialog.service';

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
