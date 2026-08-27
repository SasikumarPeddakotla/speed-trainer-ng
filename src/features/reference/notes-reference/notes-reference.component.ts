import { Component } from '@angular/core';
import { PdfViewerComponent } from '../../../shared/components/pdf-viewer/pdf-viewer.component';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/enums/theme.enum';
import { StateService } from '../../../core/services/state.service';

@Component({
  selector: 'app-number-system-reference',
  imports: [PdfViewerComponent],
  templateUrl: './notes-reference.component.html',
  styleUrl: './notes-reference.component.scss',
})
export class NotesReferenceComponent {
  src: string = '';

  constructor(
    private themeService: ThemeService,
    private stateService: StateService,
  ) {
    const title = this.stateService.navigation().selectedExercise?.title;
    const theme = this.themeService.theme();

    this.src =
      theme === Theme.Light
        ? `/notes/${title}.pdf`
        : `/notes/${title}-dark.pdf`;
  }
}
