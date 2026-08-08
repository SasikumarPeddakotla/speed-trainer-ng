import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogService } from '../../core/services/dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  readonly dialog = inject(DialogService);
}
