import { Injectable } from '@angular/core';
import { ReviewItem } from '../models/review-item.model';
import { IdService } from '../../utils/id.service';
import { StorageKeys } from '../enums/storage-keys.enum';
import { StorageService } from './storage.service';
import { PracticeMode } from '../enums/practice-mode.enum';
import { ReviewQueueSummary } from '../models/review-queue-summary.model';

interface ReviewStorage {
  version: number;
  queues: Record<string, ReviewItem<any>[]>;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(
    private idService: IdService,
    private storageService: StorageService,
  ) {
    this.load();
  }

  /**
   * One review queue per exercise.
   *
   * Example keys:
   * LetterPosition
   * LetterPosition
   * Synonyms
   * Articles
   */
  private reviewQueues = new Map<string, ReviewItem<any>[]>();

  private currentReviewItem = new Map<string, ReviewItem<any>>();

  private getQueue(exerciseKey: string): ReviewItem<any>[] {
    let queue = this.reviewQueues.get(exerciseKey);

    if (!queue) {
      queue = [];
      this.reviewQueues.set(exerciseKey, queue);
    }

    return queue;
  }

  getNextReviewQuestion<T>(): T | null {
    const exerciseKey = this.idService.getExerciseKey();
    const queue = this.getQueue(exerciseKey);
    const index = queue.findIndex((review) => review.delay === 0);

    if (index === -1) {
      return null;
    }

    const review = queue.splice(index, 1)[0];

    this.currentReviewItem.set(exerciseKey, review);

    return review.questionData as T;
  }

  advanceDelays(): void {
    const exerciseKey = this.idService.getExerciseKey();
    if (exerciseKey === PracticeMode.Bookmark) {
      return;
    }
    const queue = this.getQueue(exerciseKey);

    for (const review of queue) {
      if (review.delay > 0) {
        review.delay--;
      }
    }

    this.save();
  }

  recordWrong<T>(questionData: T, questionId: string): boolean {
    const exerciseKey = this.idService.getExerciseKey();

    if (exerciseKey === PracticeMode.Bookmark) {
      return false;
    }

    const currentReview = this.currentReviewItem.get(exerciseKey);

    // Wrong while answering a review
    if (currentReview) {
      currentReview.stage = 1;
      currentReview.delay = 3;

      const queue = this.getQueue(exerciseKey);

      const existing = queue.find(
        (review) => review.questionId === currentReview.questionId,
      );

      if (!existing) {
        queue.push(currentReview);
      }

      this.currentReviewItem.delete(exerciseKey);

      this.save();

      return true;
    }

    // Wrong on a normal question
    const queue = this.getQueue(exerciseKey);

    const existing = queue.find((review) => review.questionId === questionId);

    if (existing) {
      existing.stage = 1;
      existing.delay = 3;
    } else {
      queue.push({
        questionId,
        questionData,
        delay: 3,
        stage: 1,
      });
    }

    this.save();

    return false;
  }

  recordCorrect(): boolean {
    const exerciseKey = this.idService.getExerciseKey();

    if (exerciseKey === PracticeMode.Bookmark) {
      return false;
    }

    const review = this.currentReviewItem.get(exerciseKey);

    // Normal question
    if (!review) {
      return false;
    }

    const queue = this.getQueue(exerciseKey);

    switch (review.stage) {
      case 1:
        review.stage = 2;
        review.delay = 6;

        if (!queue.some((item) => item.questionId === review.questionId)) {
          queue.push(review);
        }

        break;

      case 2:
        review.stage = 3;
        review.delay = 10;

        if (!queue.some((item) => item.questionId === review.questionId)) {
          queue.push(review);
        }

        break;

      case 3:
        // Mastered: do not add it back.
        break;
    }

    this.currentReviewItem.delete(exerciseKey);

    this.save();

    return true;
  }

  private save(): void {
    const queues: Record<string, ReviewItem<any>[]> = {};

    // Clone queues
    for (const [key, value] of this.reviewQueues.entries()) {
      queues[key] = [...value];
    }

    // Put active review back into its queue before saving
    for (const [key, review] of this.currentReviewItem.entries()) {
      queues[key] ??= [];
      queues[key].push({
        ...review,
        delay: 0,
      });
    }

    const storage: ReviewStorage = {
      version: 1,
      queues,
    };

    this.storageService.set(StorageKeys.ReviewQueues, storage);
  }

  private load(): void {
    const storage = this.storageService.get<ReviewStorage>(
      StorageKeys.ReviewQueues,
    );

    if (!storage) {
      return;
    }

    if (storage.version !== 1) {
      return;
    }

    this.reviewQueues.clear();

    for (const [key, queue] of Object.entries(storage.queues)) {
      this.reviewQueues.set(key, queue);
    }
  }

  clear(): void {
    this.reviewQueues.clear();
    this.currentReviewItem.clear();

    this.storageService.remove(StorageKeys.ReviewQueues);
  }

  getPendingCount(mode: PracticeMode): number {
    let count = 0;

    for (const [key, queue] of this.reviewQueues.entries()) {
      const queueMode = key.split('_')[0] as PracticeMode;

      if (queueMode === mode) {
        count += queue.length;
      }
    }

    return count;
  }

  clearQueue(mode: PracticeMode): void {
    for (const key of [...this.reviewQueues.keys()]) {
      const queueMode = key.split('_')[0] as PracticeMode;

      if (queueMode === mode) {
        this.reviewQueues.delete(key);
        this.currentReviewItem.delete(key);
      }
    }

    this.save();
  }

  getReviewSummaries(): ReviewQueueSummary[] {
    const counts = this.getReviewCounts();

    return Array.from(counts.entries()).map(([mode, count]) => ({
      mode,
      count,
    }));
  }

  getReviewCounts(): Map<PracticeMode, number> {
    const counts = new Map<PracticeMode, number>();

    for (const [key, queue] of this.reviewQueues.entries()) {
      const mode = key.split('_')[0] as PracticeMode;

      counts.set(mode, (counts.get(mode) ?? 0) + queue.length);
    }

    return counts;
  }

  clearMode(mode: PracticeMode): void {
    for (const key of this.reviewQueues.keys()) {
      const exerciseMode = key.split('_')[0] as PracticeMode;
      if (exerciseMode === mode) {
        this.reviewQueues.delete(key);
        this.currentReviewItem.delete(key);
      }
    }

    this.save();
  }

  getPendingQuestions<T>(mode: PracticeMode): T[] {
    const questions: T[] = [];

    for (const [key, queue] of this.reviewQueues.entries()) {
      const queueMode = key.split('_')[0] as PracticeMode;

      if (queueMode === mode) {
        questions.push(...queue.map((item) => item.questionData as T));
      }
    }

    return questions;
  }

  removePendingQuestion(mode: PracticeMode, questionId: string): void {
    for (const [key, queue] of this.reviewQueues.entries()) {
      const queueMode = key.split('_')[0] as PracticeMode;

      if (queueMode !== mode) {
        continue;
      }

      const filtered = queue.filter((item) => item.questionId !== questionId);

      this.reviewQueues.set(key, filtered);
    }

    this.save();
  }
}
