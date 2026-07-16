export class LearningQueue<T> {
  private normalQueue: T[] = [];

  private reviewQueue: {
    item: T;
    delay: number;
  }[] = [];

  constructor(private readonly items: T[]) {
    this.reset();
  }

  next(): T {
    // Step 1: decrease delay of all review items
    for (const review of this.reviewQueue) {
      review.delay--;
    }

    // Step 2: if any review is ready, ask it
    const readyIndex = this.reviewQueue.findIndex(
      (review) => review.delay <= 0,
    );

    if (readyIndex !== -1) {
      const review = this.reviewQueue.splice(readyIndex, 1)[0];

      return review.item;
    }

    // Step 3: normal question
    if (this.normalQueue.length === 0) {
      this.normalQueue = this.shuffle([...this.items]);
    }

    return this.normalQueue.shift()!;
  }

  scheduleReview(item: T, delay = 3) {
    const exists = this.reviewQueue.some((review) => review.item === item);

    if (!exists) {
      this.reviewQueue.push({
        item,
        delay,
      });
    }
  }

  remaining(): number {
    return this.normalQueue.length + this.reviewQueue.length;
  }

  reset() {
    this.normalQueue = this.shuffle([...this.items]);
    this.reviewQueue = [];
  }

  private shuffle(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [items[i], items[j]] = [items[j], items[i]];
    }

    return items;
  }
}
