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
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss',
})
export class PdfViewerComponent implements AfterViewInit, OnDestroy {
  readonly src = input.required<string>();

  @ViewChild('pdfContainer')
  private pdfContainer!: ElementRef<HTMLDivElement>;

  private pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;

  private destroyed = false;

  error = false;

  private pdfObjectUrl: string | null = null;

  constructor(
    private themeService: ThemeService,
    private dataService: DataService,
  ) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  async ngAfterViewInit(): Promise<void> {
    await this.loadPdf(this.src());
  }

  private async loadPdf(src: string): Promise<void> {
    this.error = false;

    try {
      /*
       * Load the PDF through NotesService.
       *
       * HttpClient request can be handled by the
       * Angular service worker for offline support.
       */
      const blob = await this.dataService.loadPdf(src);

      if (this.destroyed) {
        return;
      }

      /*
       * Convert the Blob into a temporary URL that
       * PDF.js can consume.
       */
      this.pdfObjectUrl = URL.createObjectURL(blob);

      const loadingTask = pdfjsLib.getDocument(this.pdfObjectUrl);

      this.pdfDocument = await loadingTask.promise;

      if (this.destroyed) {
        return;
      }

      await this.renderPages();
    } catch (error) {
      console.error('Failed to load PDF:', error);

      this.error = true;
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

    /*
     * Release the temporary Blob URL.
     */
    if (this.pdfObjectUrl) {
      URL.revokeObjectURL(this.pdfObjectUrl);
      this.pdfObjectUrl = null;
    }
  }
}
