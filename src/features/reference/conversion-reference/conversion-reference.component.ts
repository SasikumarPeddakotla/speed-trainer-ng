import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { ConversionEngine } from '../../../core/engines/conversion.engine';
import { StateService } from '../../../core/services/state.service';
import { PracticeMode } from '../../../core/enums/practice-mode.enum';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { FractionConversion } from '../../../core/models/fraction-conversion.model';

@Component({
  selector: 'app-conversion-reference',
  imports: [],
  templateUrl: './conversion-reference.component.html',
  styleUrl: './conversion-reference.component.scss',
})
export class ConversionReferenceComponent {
  private conversionEngine = inject(ConversionEngine);
  private stateService = inject(StateService);
  private bookmarkService = inject(BookmarkService);

  readonly PracticeMode = PracticeMode;

  referenceTab = input<'all' | 'bookmark'>();
  count = output<{
    allCount: number;
    bookmarkCount: number;
  }>();

  protected readonly mode = this.stateService.navigation().selectedExercise
    ?.mode as PracticeMode;

  private readonly allQuestions = computed(() => {
    return this.conversionEngine.getConversionsReference();
  });
  private readonly bookmarkQuestions = computed(() => {
    return this.bookmarkService.getBookmarkedQuestions<FractionConversion>();
  });

  // To return the counts to parent
  private readonly emitCountsEffect = effect(() => {
    this.count.emit({
      allCount: this.allQuestions().length,
      bookmarkCount: this.bookmarkQuestions().length,
    });
  });

  readonly conversions = computed(() => {
    switch (this.referenceTab()) {
      case 'bookmark':
        return this.bookmarkQuestions();

      default:
        return this.allQuestions();
    }
  });

  async toggleBookmark(conversion: FractionConversion): Promise<void> {
    const entry = {
      id: conversion.id,
      mode: this.mode,
      question: conversion,
    };

    await this.bookmarkService.toggle(entry);
  }

  isBookmarked(conversion: FractionConversion): boolean {
    return this.bookmarkService.isBookmarked(conversion.id);
  }
}
