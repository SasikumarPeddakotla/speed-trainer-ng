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
    const wrongItems = allItems.filter(
      (item) => identitySelector(item) !== identitySelector(correctItem),
    );

    const options = this.shuffle(wrongItems)
      .slice(0, optionCount - 1)
      .map((item) => {
        const values = optionsSelector(item);

        return values[Math.floor(Math.random() * values.length)];
      });

    options.push(correctOption);

    return this.shuffle(options);
  }
}
