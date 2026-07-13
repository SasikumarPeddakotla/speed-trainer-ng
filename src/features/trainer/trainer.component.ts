import { Component } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-trainer',
  standalone: true,
  templateUrl: './trainer.component.html',
  styleUrl: './trainer.component.scss',
})
export class TrainerComponent {
  constructor(public settingsService: SettingsService) {}
}
