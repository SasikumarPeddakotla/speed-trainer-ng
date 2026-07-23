import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RandomService {
  random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomWithDigits(digits: number): number {
    const min = digits === 1 ? 2 : Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;

    return this.random(min, max);
  }

  shuffle<T>(array: T[]): T[] {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.random(0, i);

      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
  }

  getRandomItem<T>(array: T[]): T {
    return array[this.random(0, array.length - 1)];
  }

  buildOptions<T>(
    correctItem: T,
    allItems: T[],
    optionSelector: (item: T) => string,
    identitySelector: (item: T) => unknown,
    optionCount: number = 4,
  ): string[] {
    // Remove the correct object
    const wrongItems = allItems.filter(
      (item) => identitySelector(item) !== identitySelector(correctItem),
    );

    // Shuffle the remaining objects
    const shuffledWrongItems = this.shuffle(wrongItems);

    // Take the required number of wrong options
    const options = shuffledWrongItems
      .slice(0, optionCount - 1)
      .map(optionSelector);

    // Add the correct option
    options.push(optionSelector(correctItem));

    // Shuffle again so the correct answer isn't always last
    return this.shuffle(options);
  }
}
