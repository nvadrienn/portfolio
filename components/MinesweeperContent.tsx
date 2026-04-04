import React, { useState } from 'react';

type GameStatus = 'ready' | 'playing' | 'won' | 'lost';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

const ROWS = 24;
const COLS = 30;
const MINES = 140;

const palette: Record<number, string> = {
  0: 'transparent',
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#b7b7b7',
  9: '#ffffff'
};

const digitMasks: Record<number, number[][]> = {
  1: [
    [0, 1, 1, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [1, 1, 1, 1, 1]
  ],
  2: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1]
  ],
  3: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1]
  ],
  4: [
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1]
  ],
  5: [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1]
  ],
  6: [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1]
  ],
  7: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0]
  ],
  8: [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1]
  ]
};

const numberColorId: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8
};

const flagGlyph = [
  [0, 0, 9, 9, 9, 0, 0],
  [0, 9, 9, 9, 9, 0, 0],
  [0, 0, 9, 9, 9, 0, 0],
  [0, 0, 0, 7, 0, 0, 0],
  [0, 0, 0, 7, 0, 0, 0],
  [0, 0, 0, 7, 0, 0, 0],
  [0, 7, 7, 7, 7, 7, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

const mineGlyph = [
  [0, 0, 0, 7, 0, 0, 0],
  [0, 7, 0, 7, 0, 7, 0],
  [0, 0, 7, 7, 7, 0, 0],
  [7, 7, 7, 7, 7, 7, 7],
  [0, 0, 7, 7, 7, 0, 0],
  [0, 7, 0, 7, 0, 7, 0],
  [0, 0, 0, 7, 0, 0, 0],
  [0, 0, 9, 0, 0, 0, 0]
];

const makeEmptyBoard = (): Cell[][] =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0
    }))
  );

const neighbors = (row: number, col: number): Array<{ row: number; col: number }> => {
  const points: Array<{ row: number; col: number }> = [];
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (nextRow < 0 || nextRow >= ROWS || nextCol < 0 || nextCol >= COLS) continue;
      points.push({ row: nextRow, col: nextCol });
    }
  }
  return points;
};

const withMines = (safeRow: number, safeCol: number): Cell[][] => {
  const next = makeEmptyBoard();
  let planted = 0;

  while (planted < MINES) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    if ((row === safeRow && col === safeCol) || next[row][col].isMine) continue;
    next[row][col].isMine = true;
    planted += 1;
  }

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (next[row][col].isMine) continue;
      next[row][col].adjacentMines = neighbors(row, col).reduce(
        (total, point) => total + (next[point.row][point.col].isMine ? 1 : 0),
        0
      );
    }
  }

  return next;
};

const revealFlood = (board: Cell[][], startRow: number, startCol: number): number => {
  const queue: Array<{ row: number; col: number }> = [{ row: startRow, col: startCol }];
  let revealed = 0;

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const cell = board[current.row][current.col];
    if (cell.isRevealed || cell.isFlagged) continue;
    cell.isRevealed = true;
    revealed += 1;
    if (cell.adjacentMines !== 0 || cell.isMine) continue;
    for (const point of neighbors(current.row, current.col)) {
      const next = board[point.row][point.col];
      if (!next.isRevealed && !next.isMine && !next.isFlagged) {
        queue.push(point);
      }
    }
  }

  return revealed;
};

const digital = (value: number) => String(Math.max(0, value)).padStart(3, '0').slice(-3);

const PixelGlyph: React.FC<{ map: number[][]; pixelSize?: number }> = ({ map, pixelSize = 2 }) => (
  <div
    className="grid"
    style={{
      gridTemplateColumns: `repeat(${map[0].length}, ${pixelSize}px)`,
      gridTemplateRows: `repeat(${map.length}, ${pixelSize}px)`,
      lineHeight: 0
    }}
  >
    {map.flat().map((code, i) => (
      <span
        key={i}
        style={{
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          backgroundColor: palette[code]
        }}
      />
    ))}
  </div>
);

const NumberGlyph: React.FC<{ value: number }> = ({ value }) => {
  const mask = digitMasks[value];
  const colorCode = numberColorId[value];
  const map = mask.map((row) => row.map((pixel) => (pixel === 1 ? colorCode : 0)));
  return <PixelGlyph map={map} pixelSize={2} />;
};

const FaceIcon: React.FC<{ status: GameStatus }> = ({ status }) => {
  const isLost = status === 'lost';
  return (
    <span
      className="relative block rounded-full border-2 border-black bg-[#ffeb3b]"
      style={{ width: 22, height: 22 }}
    >
      {isLost ? (
        <>
          <span className="absolute left-[4px] top-[6px] text-[7px] font-bold leading-none">x</span>
          <span className="absolute right-[4px] top-[6px] text-[7px] font-bold leading-none">x</span>
          <span className="absolute left-[6px] bottom-[4px] w-[8px] h-[4px] border-t-2 border-black rounded-t-full" />
        </>
      ) : (
        <>
          <span className="absolute left-[5px] top-[6px] w-[2px] h-[2px] bg-black" />
          <span className="absolute right-[5px] top-[6px] w-[2px] h-[2px] bg-black" />
          <span className="absolute left-[6px] bottom-[6px] w-[8px] h-[2px] bg-black" />
        </>
      )}
    </span>
  );
};

const MinesweeperContent: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>(() => makeEmptyBoard());
  const [status, setStatus] = useState<GameStatus>('ready');
  const [revealedSafe, setRevealedSafe] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [isFlagMode, setIsFlagMode] = useState(false);

  const reset = () => {
    setBoard(makeEmptyBoard());
    setStatus('ready');
    setRevealedSafe(0);
    setClickCount(0);
    setIsFlagMode(false);
  };

  const revealAllMines = (nextBoard: Cell[][]) => {
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        if (nextBoard[row][col].isMine) nextBoard[row][col].isRevealed = true;
      }
    }
  };

  const handleReveal = (row: number, col: number) => {
    if (status === 'lost' || status === 'won') return;

    const existing = board[row][col];
    if (existing.isRevealed || existing.isFlagged) return;
    setClickCount((prev) => prev + 1);

    let nextBoard = board.map((boardRow) => boardRow.map((cell) => ({ ...cell })));
    if (status === 'ready') {
      nextBoard = withMines(row, col);
      setStatus('playing');
    }

    const clicked = nextBoard[row][col];
    if (clicked.isMine) {
      clicked.isRevealed = true;
      revealAllMines(nextBoard);
      setBoard(nextBoard);
      setStatus('lost');
      return;
    }

    const revealedNow = revealFlood(nextBoard, row, col);
    const nextRevealedSafe = revealedSafe + revealedNow;

    setBoard(nextBoard);
    setRevealedSafe(nextRevealedSafe);
    if (nextRevealedSafe === ROWS * COLS - MINES) {
      setStatus('won');
      return;
    }
    setStatus('playing');
  };

  const handleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (status === 'lost' || status === 'won') return;
    if (board[row][col].isRevealed) return;

    setClickCount((prev) => prev + 1);
    const nextBoard = board.map((boardRow) => boardRow.map((cell) => ({ ...cell })));
    nextBoard[row][col].isFlagged = !nextBoard[row][col].isFlagged;
    setBoard(nextBoard);
    if (status === 'ready') setStatus('playing');
  };

  return (
    <div className="w-full h-full bg-[#c0c0c0] flex flex-col text-[11px] text-black">
      <div className="px-2 py-1 border-b border-[#808080] flex gap-4">
        <span>Game</span>
        <span>Help</span>
      </div>

      <div className="p-2 flex-1">
        <div className="win95-bevel-inset p-2 bg-[#c0c0c0] h-full flex flex-col gap-2">
          <div className="win95-bevel-inset p-2 bg-[#c0c0c0] flex items-center justify-between">
            <div className="bg-black text-[#ff0000] font-mono font-bold text-[20px] leading-none px-2 py-1 min-w-[64px] text-center">
              000
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFlagMode((prev) => !prev)}
                className={`win95-bevel min-w-[60px] px-2 py-1 text-[10px] font-bold active:win95-bevel-inset sm:hidden ${isFlagMode ? 'win95-bevel-inset bg-[#dcdcdc]' : 'bg-[#c0c0c0]'}`}
                aria-pressed={isFlagMode}
              >
                {isFlagMode ? 'FLAG' : 'OPEN'}
              </button>
              <button
                type="button"
                onClick={reset}
                className="win95-bevel bg-[#c0c0c0] w-8 h-8 flex items-center justify-center active:win95-bevel-inset"
                aria-label="Reset Minesweeper"
                title="Reset"
              >
                <FaceIcon status={status} />
              </button>
            </div>
            <div className="bg-black text-[#ff0000] font-mono font-bold text-[20px] leading-none px-2 py-1 min-w-[64px] text-center">
              {digital(clickCount)}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            <div
              className="win95-bevel-inset p-1 grid gap-0 bg-[#c0c0c0] w-max"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            >
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    type="button"
                    onClick={(e) => {
                      if (isFlagMode) {
                        handleFlag(e, rowIndex, colIndex);
                        return;
                      }
                      handleReveal(rowIndex, colIndex);
                    }}
                    onContextMenu={(e) => handleFlag(e, rowIndex, colIndex)}
                    className={`w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center leading-none touch-manipulation ${
                      cell.isRevealed
                        ? 'bg-[#c0c0c0] border border-[#808080]'
                        : 'bg-[#c0c0c0] win95-bevel active:win95-bevel-inset'
                    }`}
                    aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}`}
                  >
                    {cell.isFlagged && <PixelGlyph map={flagGlyph} pixelSize={1.8} />}
                    {cell.isRevealed && cell.isMine && <PixelGlyph map={mineGlyph} pixelSize={1.8} />}
                    {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 && (
                      <NumberGlyph value={cell.adjacentMines} />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="px-1 text-[10px] sm:hidden">
            Tap cells to open. Use `FLAG` mode to place or remove flags.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinesweeperContent;
