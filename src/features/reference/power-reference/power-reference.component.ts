import { Component, inject } from '@angular/core';
import { PowerEngine } from '../../../core/engines/power.engine';
import { SettingsService } from '../../../core/services/settings.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { StudyListService } from '../../../core/services/study-list.service';
import { PowerQuestion } from '../../../core/models/power-question.model';

@Component({
  selector: 'app-power-reference',
  imports: [],
  templateUrl: './power-reference.component.html',
  styleUrl: './power-reference.component.scss',
})
export class PowerReferenceComponent {
  private settingsService = inject(SettingsService);
  private powerEngine = inject(PowerEngine);

  private studyListService = inject(StudyListService);

  public PracticeMode = PracticeMode;

  protected readonly mode =
    this.settingsService.settings().selectedExercise?.mode;

  protected readonly numbers =
    this.studyListService.getQuestions<PowerQuestion>()?.map((q) => q.number) ??
    this.powerEngine.getNumbersReference();
}
