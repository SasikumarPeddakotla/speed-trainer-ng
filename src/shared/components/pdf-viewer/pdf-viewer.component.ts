import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import * as pdfjsLib from 'pdfjs-dist';

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

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  async ngAfterViewInit(): Promise<void> {
    await this.loadPdf();
  }

  private async loadPdf(): Promise<void> {
    try {
      const loadingTask = pdfjsLib.getDocument(this.src());

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

    const scale = containerWidth / unscaledViewport.width;

    const viewport = page.getViewport({
      scale,
    });

    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    const pageWrapper = document.createElement('div');

    pageWrapper.className = 'pdf-page';

    pageWrapper.appendChild(canvas);

    container.appendChild(pageWrapper);

    await page.render({
      canvasContext: context,
      viewport,
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
