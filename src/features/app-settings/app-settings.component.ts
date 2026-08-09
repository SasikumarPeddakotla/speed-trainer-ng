import { Component, inject } from '@angular/core';
import { BookmarkService } from '../../core/services/bookmark.service';
import { ReviewService } from '../../core/services/review.service';
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
  private reviewService = inject(ReviewService);
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

  clearAllWeakQuestions(): void {
    this.dialogService.openConfirm({
      title: 'Clear weak questions',
      message: 'Remove all weak questions from the review queue?',
      confirmText: 'Clear',
      cancelText: 'Cancel',
      onConfirm: () => this.reviewService.clearAll(),
    });
  }
}
