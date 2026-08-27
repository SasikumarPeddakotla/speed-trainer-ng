import { Component } from '@angular/core';
import { PdfViewerComponent } from '../../../shared/components/pdf-viewer/pdf-viewer.component';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/enums/theme.enum';

@Component({
  selector: 'app-number-system-reference',
  imports: [PdfViewerComponent],
  templateUrl: './number-system-reference.component.html',
  styleUrl: './number-system-reference.component.scss',
})
export class NumberSystemReferenceComponent {
  src: string = '';

  constructor(private themeService: ThemeService) {
    this.src =
      this.themeService.theme() === Theme.Light
        ? '/notes/Number System Aug 25, 2026 6-09 AM.pdf'
        : '/notes/Number System Aug 25, 2026 6-09 AM-dark.pdf';
  }
}
