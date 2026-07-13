import { Component } from '@angular/core';
import { TrainerComponent } from '../features/trainer/trainer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TrainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
