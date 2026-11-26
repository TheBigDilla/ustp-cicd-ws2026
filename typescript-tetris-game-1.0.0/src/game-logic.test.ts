
import { describe, it, expect } from 'vitest';
import {
  COLUMNS,
  ROWS,
  SHAPES,
  createBoard,
  createPiece,
  rotate,
  collision,
} from './game-logic';

describe('createBoard', () => {
  it('creates a board with 20 rows and 10 columns', () => {
    const board = createBoard();

    expect(board).toHaveLength(ROWS);
    expect(board.every((row) => row.length === COLUMNS)).toBe(true);
  });

  it('initializes every cell as empty', () => {
    const board = createBoard();

    expect(board.every((row) => row.every((cell) => cell === null))).toBe(true);
  });
});

describe('SHAPES', () => {
  it('contains all seven Tetris piece types', () => {
    expect(Object.keys(SHAPES).sort()).toEqual(
      ['I', 'J', 'L', 'O', 'S', 'T', 'Z'].sort(),
    );
  });

  it('defines the correct number of blocks for every piece', () => {
    for (const shape of Object.values(SHAPES)) {
      const blockCount = shape.flat().filter((cell) => cell === 1).length;
      expect(blockCount).toBe(4);
    }
  });
});

describe('createPiece', () => {
  it('creates a piece at the top of the board', () => {
    const piece = createPiece('T');

    expect(piece.type).toBe('T');
    expect(piece.y).toBe(0);
    expect(piece.matrix).toEqual(SHAPES.T);
  });

  it('centers pieces horizontally', () => {
    const piece = createPiece('I');

    expect(piece.x).toBe(3);
  });

  it('creates an independent matrix for each piece', () => {
    const first = createPiece('T');
    const second = createPiece('T');

    first.matrix[0][1] = 0;

    expect(second.matrix).toEqual(SHAPES.T);
  });
});

describe('rotate', () => {
  it('rotates a matrix clockwise', () => {
    const matrix = [
      [1, 0],
      [1, 1],
    ];

    expect(rotate(matrix)).toEqual([
      [1, 1],
      [1, 0],
    ]);
  });

  it('rotates a rectangular matrix and changes its dimensions', () => {
    const matrix = [
      [1, 1, 1],
      [0, 1, 0],
    ];

    const result = rotate(matrix);

    expect(result).toEqual([
      [0, 1],
      [1, 1],
      [0, 1],
    ]);
    expect(result).toHaveLength(3);
    expect(result[0]).toHaveLength(2);
  });
});

describe('collision', () => {
  it('does not detect a collision on an empty board', () => {
    const board = createBoard();
    const piece = createPiece('O');

    expect(collision(piece, board)).toBe(false);
  });

  it('detects the left board boundary', () => {
    const board = createBoard();
    const piece = createPiece('O');
    piece.x = 0;

    expect(collision(piece, board, -1, 0)).toBe(true);
  });

  it('detects the right board boundary', () => {
    const board = createBoard();
    const piece = createPiece('O');
    piece.x = COLUMNS - 2;

    expect(collision(piece, board, 1, 0)).toBe(true);
  });

  it('detects the bottom board boundary', () => {
    const board = createBoard();
    const piece = createPiece('O');
    piece.y = ROWS - 2;

    expect(collision(piece, board, 0, 1)).toBe(true);
  });

  it('detects a collision with an occupied cell', () => {
    const board = createBoard();
    const piece = createPiece('O');

    board[1][piece.x] = 'T';

    expect(collision(piece, board)).toBe(true);
  });

  it('allows pieces to move above the top of the board', () => {
    const board = createBoard();
    const piece = createPiece('I');
    piece.y = -1;

    expect(collision(piece, board)).toBe(false);
  });
});
