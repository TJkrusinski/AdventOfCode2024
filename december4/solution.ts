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

const word = 'XMAS'
const wordLength = word.length;

type Position = {
  x: number,
  y: number
};

const hasSpaceLeft = (position: Position): boolean => {
  if (position.x - (wordLength - 1) < 0) {
    return false;
  } else {
    return true;
  }
}

assert(hasSpaceLeft({x: 2, y: 0}) === false, 'Should return false on the left on space left: 2');
assert(hasSpaceLeft({x: 3, y: 0}) === true, 'Should return true on the left on space left: 3');

const hasSpaceRight = (position: Position): boolean => {
  if (position.x + (wordLength - 1) > width) {
    return false;
  } else {
    return true;
  }
}

assert(hasSpaceRight({x: 137, y: 0}) === false, `Should return false on has space right: 137, got ${hasSpaceRight({x: 137, y: 0})}`);
assert(hasSpaceRight({x: 136, y: 0}) === true, `Should return true on has space right: 136, got ${hasSpaceRight({x: 136, y: 0})}`);

const hasSpaceDown = (position: Position): boolean => {
  if (position.y + (wordLength - 1) > height) {
    return false;
  } else {
    return true;
  }
}

assert(hasSpaceDown({x: 137, y: 137}) === false, 'Should return false on space down: 137');
assert(hasSpaceDown({x: 136, y: 136}) === true, 'Should return true on space down: 136');

const hasSpaceUp = (position: Position): boolean => {
  if (position.y - (wordLength - 1) < 0) {
    return false;
  } else {
    return true;
  }
}

assert(hasSpaceUp({x: 137, y: 2}) === false, 'Should return false on space up: 2');
assert(hasSpaceUp({x: 136, y: 3}) === true, 'Should return true on space up: 3');

const hasSpaceUpLeft = (position: Position): boolean => {
  if (position.x - (wordLength - 1) < 0 || position.y - (wordLength - 1) < 0) {
    return false;
  } else {
    return true;
  }
}

assert(hasSpaceUpLeft({x: 2, y: 2}) === false, 'Should return false on space upLeft: x2 y2');
assert(hasSpaceUpLeft({x: 3, y: 3}) === true, 'Should return true on space upLeft: x3 y3');

const hasSpaceUpRight = (position: Position): boolean => {
  if (position.x + wordLength - 1 > width || position.y - (wordLength - 1) < 0) {
    return false;
  } else {
    return true;
  }
}

assert(hasSpaceUpRight({x: 137, y: 2}) === false, 'Should return false on space upRight: x137 y2');
assert(hasSpaceUpRight({x: 137, y: 3}) === false, 'Should return false on space upRight: x137 y3');
assert(hasSpaceUpRight({x: 138, y: 3}) === false, 'Should return false on space upRight: x138 y3');
assert(hasSpaceUpRight({x: 136, y: 3}) === true, 'Should return true on space upRight: x136 y3');

const hasSpaceDownLeft = (position: Position): boolean => {
  if (position.x - (wordLength - 1) < 0 || position.y + wordLength - 1 > height) {
    return false;
  } else {
    return true;
  }
}

assert(hasSpaceDownLeft({x: 2, y: 137}) === false, 'Should return false on space downRight: x2 y137');
assert(hasSpaceDownLeft({x: 2, y: 138}) === false, 'Should return false on space downRight: x2 y138');
assert(hasSpaceDownLeft({x: 3, y: 137}) === false, 'Should return false on space downRight: x3 y137');
assert(hasSpaceDownLeft({x: 3, y: 136}) === true, 'Should return true on space downRight: x3 y136');

const hasSpaceDownRight = (position: Position): boolean => {
  if (position.x + wordLength - 1 > width || position.y + wordLength - 1 > height) {
    return false;
  } else {
    return true;
  }
}

assert(hasSpaceDownRight({x: 137, y: 137}) === false, 'Should return false on space downRight: x137 y137');
assert(hasSpaceDownRight({x: 136, y: 136}) === true, 'Should return true on space downRight: x136 y136');

const getCharsUp = (position: Position): string | null => {
  if (hasSpaceUp(position)) {
    let chars = '';
    for (let i = 0; i<wordLength; i++) {
      chars += matrix[position.y - i][position.x];
    }
    return chars;
  } else {
    return null;
  }
}

const charsUp1 = getCharsUp({x: 69, y: 139});
assert(charsUp1 === 'XMAS', `Should return XMAS on getCharsUp: x69 y139, actually returned ${charsUp1}`);

const getCharsDown = (position: Position): string | null=> {
  if (hasSpaceDown(position)) {
    let chars = '';
    for (let i = 0; i<wordLength; i++) {
      chars += matrix[position.y + i][position.x];
    }
    return chars;
  } else {
    return null;
  }
}

const charsDown1 = getCharsDown({x: 69, y: 0});
assert(charsDown1 === 'MAAA', `Should return MAAA on getCharsDown: x69 y0, actually returned ${charsDown1}`);

const getCharsLeft = (position: Position): string | null => {
  if (hasSpaceLeft(position)) {
    let chars = '';
    for (let i = 0; i<wordLength; i++) {
      chars += matrix[position.y][position.x - i];
    }
    return chars;
  } else {
    return null;
  }
}

const charsLeft = getCharsLeft({x: 3, y: 0});
assert(charsLeft === 'XMAS', `Should return XMAS on getCharsLeft: x3 y0, actually returned ${charsLeft}`);

const charsLeft1 = getCharsLeft({x: 139, y: 53});
assert(charsLeft1 === 'AAMM', `Should return AAMM on getCharsLeft: x139 y53, actually returned ${charsLeft1}`);

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

const charsRight1 = getCharsRight({x: 0, y: 39});
assert(charsRight1 === 'SAMX', `Should return SAMX on getCharsRight: x0 y39, actually returned ${charsRight1}`);


const charsRight2 = getCharsRight({x: 136, y: 0});
assert(charsRight2 === 'XSAS', `Should return XSAS on getCharsRight: x136 y0, actually returned ${charsRight2}`);

const getCharsUpRight = (position: Position): string | null => {
  if (hasSpaceUpRight(position)) {
    let chars = '';
    for (let i = 0; i<wordLength; i++) {
      chars += matrix[position.y - i][position.x + i];
    }
    return chars;
  } else {
    return null;
  }
}

const charsUpRight1 = getCharsUpRight({x: 1, y: 65});
assert(charsUpRight1 === 'AMAS', `Should return AMAS on getCharsUpRight: x1 y65, actually returned ${charsUpRight1}`);

const getCharsUpLeft = (position: Position): string | null => {
  if (hasSpaceUpLeft(position)) {
    let chars = '';
    for (let i = 0; i<wordLength; i++) {
      chars += matrix[position.y - i][position.x - i];
    }
    return chars;
  } else {
    return null;
  }
}

const charsUpLeft = getCharsUpLeft({x: 3, y: 3});
assert(charsUpLeft === 'MXMS', `Should return MXMS on getCharsUpLeft: x3 y3, actually returned ${charsUpLeft}`);

const getCharsDownRight = (position: Position): string | null => {
  if (hasSpaceDownRight(position)) {
    let chars = '';
    for (let i = 0; i<wordLength; i++) {
      chars += matrix[position.y + i][position.x + i];
    }
    return chars;
  } else {
    return null;
  }
}

const charsDownRight1 = getCharsDownRight({x: 136, y: 136});
assert(charsDownRight1 === 'MMAS', `Should return MMAS on getCharsDownRight: x136 y136, actually returned ${charsDownRight1}`);

const getCharsDownLeft = (position: Position): string | null => {
  if (hasSpaceDownLeft(position)) {
    let chars = '';
    for (let i = 0; i<wordLength; i++) {
      chars += matrix[position.y + i][position.x - i];
    }
    return chars;
  } else {
    return null;
  }
}

const charsDownLeft1 = getCharsDownLeft({x: 3, y: 136});
assert(charsDownLeft1 === 'XMAS', `Should return XMAS on getCharsDownLeft: x3 y136, actually returned ${charsDownLeft1}`);

let total = 0;

for (let y = 0; y<=height; y++) {
  for (let x = 0; x<=width; x++) {
    const position: Position = {
      x,
      y
    }

    const charsUp = getCharsUp(position);
    const charsDown = getCharsDown(position);

    const charsLeft = getCharsLeft(position);
    const charsRight = getCharsRight(position);

    const charsUpLeft = getCharsUpLeft(position);
    const charsUpRight = getCharsUpRight(position);

    const charsDownLeft = getCharsDownLeft(position);
    const charsDownRight = getCharsDownRight(position);

    if (charsUp === word) {
      total++;
    }

    if (charsDown === word) {
      total++;
    }

    if (charsLeft === word) {
      total++;
    }

    if (charsRight === word) {
      total++;
    }

    if (charsUpLeft === word) {
      total++;
    }

    if (charsUpRight === word) {
      total++;
    }

    if (charsDownLeft === word) {
      total++;
    }

    if (charsDownRight === word) {
      total++;
    }
  }
}

console.log(total);