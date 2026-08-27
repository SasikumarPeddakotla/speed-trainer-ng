import { inject, Injectable } from '@angular/core';

import { StateService } from '../services/state.service';
import { Question } from '../models/question.model';
import { RandomService } from '../../utils/random.service';
import { BookmarkService } from '../services/bookmark.service';
import { DataService } from '../services/data.service';

import { Square } from '../models/square.model';
import { Cube } from '../models/cube.model';
import { SquareRoot } from '../models/square-root.model';
import { CubeRoot } from '../models/cube-root.model';

@Injectable({
  providedIn: 'root',
})
export class PowerEngine {
  private randomService = inject(RandomService);

  private squares: Square[] = [];
  private cubes: Cube[] = [];
  private squareRoots: SquareRoot[] = [];
  private cubeRoots: CubeRoot[] = [];

  constructor(
    private stateService: StateService,
    private bookmarkService: BookmarkService,
    private dataService: DataService,
  ) {}

  // ========================================
  // Squares
  // ========================================

  generateSquare(): Question<number> {
    const square = this.nextSquare();

    return {
      id: square.id,
      question: `${square.number}²`,
      answer: String(square.square),
      data: square.number,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  // ========================================
  // Cubes
  // ========================================

  generateCube(): Question<number> {
    const cube = this.nextCube();

    return {
      id: cube.id,
      question: `${cube.number}³`,
      answer: String(cube.cube),
      data: cube.number,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  // ========================================
  // Square Roots
  // ========================================

  generateSquareRoot(): Question<number> {
    const squareRoot = this.nextSquareRoot();

    return {
      id: squareRoot.id,
      question: `√${squareRoot.number}`,
      answer: String(squareRoot.squareRoot),
      data: squareRoot.squareRoot,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  // ========================================
  // Cube Roots
  // ========================================

  generateCubeRoot(): Question<number> {
    const cubeRoot = this.nextCubeRoot();

    return {
      id: cubeRoot.id,
      question: `∛${cubeRoot.number}`,
      answer: String(cubeRoot.cubeRoot),
      data: cubeRoot.cubeRoot,
      inputType: 'number',
      displayType: 'symbol',
    };
  }

  // ========================================
  // Squares
  // ========================================

  private nextSquare(): Square {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalSquare();

      case 'bookmark':
        return this.nextBookmarkedSquare();
    }
  }

  private nextNormalSquare(): Square {
    if (this.squares.length === 0) {
      this.resetSquares();
    }

    return this.squares.shift()!;
  }

  private nextBookmarkedSquare(): Square {
    if (this.squares.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<Square>();

      this.squares = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.squares.shift()!;
  }

  private resetSquares(): void {
    const max = Number(this.stateService.practice().numberRange);

    const questions = this.dataService
      .getSquares()
      .filter((square) => square.number <= max);

    this.squares = this.randomService.shuffle(questions);
  }

  // ========================================
  // Cubes
  // ========================================

  private nextCube(): Cube {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalCube();

      case 'bookmark':
        return this.nextBookmarkedCube();
    }
  }

  private nextNormalCube(): Cube {
    if (this.cubes.length === 0) {
      this.resetCubes();
    }

    return this.cubes.shift()!;
  }

  private nextBookmarkedCube(): Cube {
    if (this.cubes.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<Cube>();

      this.cubes = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.cubes.shift()!;
  }

  private resetCubes(): void {
    const max = Number(this.stateService.practice().numberRange);

    const questions = this.dataService
      .getCubes()
      .filter((cube) => cube.number <= max);

    this.cubes = this.randomService.shuffle(questions);
  }

  // ========================================
  // Square Roots
  // ========================================

  private nextSquareRoot(): SquareRoot {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalSquareRoot();

      case 'bookmark':
        return this.nextBookmarkedSquareRoot();
    }
  }

  private nextNormalSquareRoot(): SquareRoot {
    if (this.squareRoots.length === 0) {
      this.resetSquareRoots();
    }

    return this.squareRoots.shift()!;
  }

  private nextBookmarkedSquareRoot(): SquareRoot {
    if (this.squareRoots.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<SquareRoot>();

      this.squareRoots = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.squareRoots.shift()!;
  }

  private resetSquareRoots(): void {
    const max = Number(this.stateService.practice().numberRange);

    const questions = this.dataService
      .getSquareRoots()
      .filter((squareRoot) => squareRoot.squareRoot <= max);

    this.squareRoots = this.randomService.shuffle(questions);
  }

  // ========================================
  // Cube Roots
  // ========================================

  private nextCubeRoot(): CubeRoot {
    const referenceView = this.stateService.navigation().referenceView;

    switch (referenceView) {
      case 'all':
        return this.nextNormalCubeRoot();

      case 'bookmark':
        return this.nextBookmarkedCubeRoot();
    }
  }

  private nextNormalCubeRoot(): CubeRoot {
    if (this.cubeRoots.length === 0) {
      this.resetCubeRoots();
    }

    return this.cubeRoots.shift()!;
  }

  private nextBookmarkedCubeRoot(): CubeRoot {
    if (this.cubeRoots.length === 0) {
      const bookmarkQuestions =
        this.bookmarkService.getBookmarkedQuestions<CubeRoot>();

      this.cubeRoots = this.randomService.shuffle(bookmarkQuestions);
    }

    return this.cubeRoots.shift()!;
  }

  private resetCubeRoots(): void {
    const max = Number(this.stateService.practice().numberRange);

    const questions = this.dataService
      .getCubeRoots()
      .filter((cubeRoot) => cubeRoot.cubeRoot <= max);

    this.cubeRoots = this.randomService.shuffle(questions);
  }

  // ========================================
  // Reference
  // ========================================

  getSquaresReference(): Square[] {
    return this.dataService.getSquares();
  }

  getCubesReference(): Cube[] {
    return this.dataService.getCubes();
  }

  getSquareRootsReference(): SquareRoot[] {
    return this.dataService.getSquareRoots();
  }

  getCubeRootsReference(): CubeRoot[] {
    return this.dataService.getCubeRoots();
  }

  // ========================================
  // Reset
  // ========================================

  reset(): void {
    this.squares = [];
    this.cubes = [];
    this.squareRoots = [];
    this.cubeRoots = [];
  }
}
