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
    optionsSelector: (item: T) => string[],
    identitySelector: (item: T) => unknown,
    correctOption: string,
    optionCount: number = 4,
  ): string[] {
    const correctIdentity = identitySelector(correctItem);

    const wrongItems = allItems.filter(
      (item) =>
        identitySelector(item) !== correctIdentity &&
        !optionsSelector(item).includes(correctOption),
    );

    const options: string[] = [];

    for (const item of this.shuffle(wrongItems)) {
      const values = optionsSelector(item);

      // Remove values already selected
      const availableValues = values.filter(
        (value) => !options.includes(value),
      );

      if (availableValues.length === 0) {
        continue;
      }

      const randomValue =
        availableValues[Math.floor(Math.random() * availableValues.length)];

      options.push(randomValue);

      if (options.length === optionCount - 1) {
        break;
      }
    }

    options.push(correctOption);

    return this.shuffle(options);
  }
}
