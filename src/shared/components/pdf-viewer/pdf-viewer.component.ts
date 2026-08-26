import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import * as pdfjsLib from 'pdfjs-dist';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/enums/theme.enum';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss',
})
export class PdfViewerComponent implements AfterViewInit, OnDestroy {
  readonly lightSrc = input.required<string>();
  readonly darkSrc = input.required<string>();

  @ViewChild('pdfContainer')
  private pdfContainer!: ElementRef<HTMLDivElement>;

  private pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;

  private destroyed = false;

  constructor(private themeService: ThemeService) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.themeService.theme() === Theme.Light) {
      await this.loadPdf(this.lightSrc());
    } else {
      await this.loadPdf(this.darkSrc());
    }
  }

  private async loadPdf(src: string): Promise<void> {
    try {
      const loadingTask = pdfjsLib.getDocument(src);

      this.pdfDocument = await loadingTask.promise;

      if (this.destroyed) {
        return;
      }

      await this.renderPages();
    } catch (error) {
      console.error('Failed to load PDF:', error);
    }
  }

  private async renderPages(): Promise<void> {
    if (!this.pdfDocument) {
      return;
    }

    const container = this.pdfContainer.nativeElement;

    container.innerHTML = '';

    for (
      let pageNumber = 1;
      pageNumber <= this.pdfDocument.numPages;
      pageNumber++
    ) {
      if (this.destroyed) {
        return;
      }

      await this.renderPage(pageNumber, container);
    }
  }

  private async renderPage(
    pageNumber: number,
    container: HTMLDivElement,
  ): Promise<void> {
    if (!this.pdfDocument) {
      return;
    }

    const page = await this.pdfDocument.getPage(pageNumber);

    const containerWidth = container.clientWidth;

    const unscaledViewport = page.getViewport({
      scale: 1,
    });

    // Fit the PDF page to the available container width.
    const scale = containerWidth / unscaledViewport.width;

    const viewport = page.getViewport({
      scale,
    });

    /*
     * Render at the device's actual pixel density.
     *
     * Example:
     * CSS size = 400px
     * devicePixelRatio = 2
     * canvas resolution = 800px
     *
     * This keeps text and handwriting sharp on
     * high-DPI mobile and desktop screens.
     */
    const outputScale = window.devicePixelRatio || 1;

    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    // Actual canvas resolution
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);

    // Visual/CSS size
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    const pageWrapper = document.createElement('div');

    pageWrapper.className = 'pdf-page';

    pageWrapper.appendChild(canvas);

    container.appendChild(pageWrapper);

    await page.render({
      canvasContext: context,
      viewport,

      transform:
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
    }).promise;
  }

  ngOnDestroy(): void {
    this.destroyed = true;

    if (this.pdfDocument) {
      this.pdfDocument.destroy();
      this.pdfDocument = null;
    }
  }
}
