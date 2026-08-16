import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogComponent } from '../features/confirm-dialog/confirm-dialog.component';
import { SnackbarComponent } from '../features/snackbar/snackbar.component';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import { BottomNavComponent } from '../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ConfirmDialogComponent,
    SnackbarComponent,
    LoadingComponent,
    BottomNavComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
