import { Injectable } from '@angular/core';
import { ReviewItem } from '../models/review-item.model';
import { ExerciseService } from '../../utils/exercise.service';
import { StorageKeys } from '../enums/storage-keys.enum';
import { StorageService } from './storage.service';

interface ReviewStorage {
  version: number;
  queues: Record<string, ReviewItem<any>[]>;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(
    private exerciseService: ExerciseService,
    private storageService: StorageService,
  ) {
    this.load();
  }

  /**
   * One review queue per exercise.
   *
   * Example keys:
   * LetterPosition_Forward
   * LetterPosition_Backward
   * Synonyms
   * Articles_Forward
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
    const exerciseKey = this.exerciseService.getExerciseKey();
    const queue = this.getQueue(exerciseKey);
    const index = queue.findIndex((review) => review.delay === 0);

    if (index === -1) {
      return null;
    }

    const review = queue.splice(index, 1)[0];

    this.currentReviewItem.set(exerciseKey, review);

    return review.question as T;
  }

  advanceDelays(): void {
    const exerciseKey = this.exerciseService.getExerciseKey();
    const queue = this.getQueue(exerciseKey);

    for (const review of queue) {
      if (review.delay > 0) {
        review.delay--;
      }
    }

    this.save();
  }

  recordWrong<T>(question: T): boolean {
    const exerciseKey = this.exerciseService.getExerciseKey();
    const currentReview = this.currentReviewItem.get(exerciseKey);

    // Wrong while answering a review
    if (currentReview) {
      currentReview.stage = 1;
      currentReview.delay = 3;

      this.getQueue(exerciseKey).push(currentReview);

      this.currentReviewItem.delete(exerciseKey);

      return true;
    }

    // Wrong on a normal question
    const queue = this.getQueue(exerciseKey);

    const existing = queue.find((review) => review.question === question);

    if (existing) {
      existing.stage = 1;
      existing.delay = 3;
    } else {
      queue.push({
        question,
        delay: 3,
        stage: 1,
      });
    }

    this.save();
    return false;
  }

  recordCorrect(): boolean {
    const exerciseKey = this.exerciseService.getExerciseKey();
    const review = this.currentReviewItem.get(exerciseKey);

    // Normal question
    if (!review) {
      return false;
    }

    switch (review.stage) {
      case 1:
        review.stage = 2;
        review.delay = 6;
        this.getQueue(exerciseKey).push(review);
        break;

      case 2:
        review.stage = 3;
        review.delay = 10;
        this.getQueue(exerciseKey).push(review);
        break;

      case 3:
        // Mastered.
        // Do not add it back.
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
}
