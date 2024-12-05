// https://adventofcode.com/2024/day/4

import assert from "node:assert";

// https://adventofcode.com/2024/day/4/input
const file = Deno.openSync('./december4/input.txt');

const buffer = new Uint8Array(file.statSync().size);

file.readSync(buffer);

const text = new TextDecoder().decode(buffer);

const matrix: Array<Array<string>> = [];

text.split('\n').forEach((row) => {
  matrix.push(row.split(''));
});

const height = matrix.length - 1;
const width = matrix[0].length - 1;

assert(height === 139, `There should be 140 rows actual was ${matrix.length - 1}`);
assert(width === 139, `There should be 140 columns actual was ${matrix[0].length - 1}`);

const word = 'M.S'
const wordLength = word.length;

type Position = {
  x: number,
  y: number
};

type Kernel = [string, string, string]

const kernel1: Kernel = [
  'M.S',
  '.A.',
  'M.S'
];

const kernel2: Kernel = [
  'M.M',
  '.A.',
  'S.S'
];

const kernel3: Kernel = [
  'S.M',
  '.A.',
  'S.M'
];

const kernel4: Kernel = [
  'S.S',
  '.A.',
  'M.M'
];

const hasSpaceRight = (position: Position): boolean => {
  if (position.x + (wordLength - 1) > width) {
    return false;
  } else {
    return true;
  }
}

assert(hasSpaceRight({x: 138, y: 0}) === false, `Should return false on has space right: 138, got ${hasSpaceRight({x: 138, y: 0})}`);
assert(hasSpaceRight({x: 137, y: 0}) === true, `Should return true on has space right: 137, got ${hasSpaceRight({x: 137, y: 0})}`);

const hasSpaceDown = (position: Position): boolean => {
  if (position.y + (wordLength - 1) > height) {
    return false;
  } else {
    return true;
  }
}

assert(hasSpaceDown({x: 138, y: 138}) === false, 'Should return false on space down: 138');
assert(hasSpaceDown({x: 137, y: 137}) === true, 'Should return true on space down: 137');

const getCharsRight = (position: Position): string | null => {
  if (hasSpaceRight(position)) {
    let chars = '';
    for (let i = 0; i<wordLength; i++) {
      chars += matrix[position.y][position.x + i];
    }
    return chars;
  } else {
    return null;
  }
}

let total = 0;

const matchKernel = (position: Position, kernel: Kernel): boolean => {
  if (
    hasSpaceRight(position) &&
    hasSpaceDown(position) 
  ) {
    const charsLine1 = getCharsRight(position);
    const charsLine2 = getCharsRight({x: position.x, y: position.y + 1});
    const charsLine3 = getCharsRight({x: position.x, y: position.y + 2});

    const kernelLine1 = kernel[0];
    const kernelLine2 = kernel[1];
    const kernelLine3 = kernel[2];

    if (!charsLine1 || !charsLine2 || !charsLine3) {
      return false;
    }

    if (
      charsLine1[0] === kernelLine1[0] &&
      charsLine1[2] === kernelLine1[2] &&
      charsLine2[1] === kernelLine2[1] &&
      charsLine3[0] === kernelLine3[0] &&
      charsLine3[2] === kernelLine3[2] 
    ) {
      return true;
    }
  }

  return false;
};

for (let y = 0; y<=height; y++) {
  for (let x = 0; x<=width; x++) {
    const position: Position = {
      x,
      y
    }
    const match1 = matchKernel(position, kernel1);
    const match2 = matchKernel(position, kernel2);
    const match3 = matchKernel(position, kernel3);
    const match4 = matchKernel(position, kernel4);

    if (match1) {
      total++;
    }

    if (match2) {
      total++;
    }

    if (match3) {
      total++;
    }

    if (match4) {
      total++;
    }
  }
}

console.log(total);