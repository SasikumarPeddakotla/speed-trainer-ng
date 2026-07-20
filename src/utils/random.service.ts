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
}
