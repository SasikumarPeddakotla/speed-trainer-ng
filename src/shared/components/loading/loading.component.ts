import { Component, inject } from '@angular/core';

import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  protected readonly loadingService = inject(LoadingService);

  protected readonly clockTicks = Array.from(
    { length: 12 },
    (_, index) => index,
  );
}
