
export const COLUMNS = 10;
export const ROWS = 20;

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type Matrix = number[][];
export type Board = (PieceType | null)[][];
export type Piece = {
  type: PieceType;
  matrix: Matrix;
  x: number;
  y: number;
};

export const SHAPES: Record<PieceType, Matrix> = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
};

export function createBoard(): Board {
  return Array.from(
    { length: ROWS },
    () => Array<PieceType | null>(COLUMNS).fill(null),
  );
}

export function createPiece(type: PieceType): Piece {
  const matrix = SHAPES[type].map((row) => [...row]);

  return {
    type,
    matrix,
    x: Math.floor((COLUMNS - matrix[0].length) / 2),
    y: 0,
  };
}

export function rotate(matrix: Matrix): Matrix {
  return matrix[0].map((_, column) =>
    matrix.map((row) => row[column]).reverse(),
  );
}

export function collision(
  piece: Piece,
  board: Board,
  dx = 0,
  dy = 0,
  matrix = piece.matrix,
): boolean {
  return matrix.some((row, rowIndex) =>
    row.some((value, columnIndex) => {
      if (!value) return false;

      const x = piece.x + columnIndex + dx;
      const y = piece.y + rowIndex + dy;

      return (
        x < 0 ||
        x >= COLUMNS ||
        y >= ROWS ||
        (y >= 0 && board[y][x] !== null)
      );
    }),
  );
}
