// https://adventofcode.com/2024/day/6

import assert from "node:assert";

// https://adventofcode.com/2024/day/6/input
const file = Deno.openSync('./december6/input.txt');

const buffer = new Uint8Array(file.statSync().size);

file.readSync(buffer);

const text = new TextDecoder().decode(buffer);

const lines = text.trim().split('\n');

type GuardOrientation = '>' | 'v' | '^' | '<';

type Blank = '.';

type Hazard = '#';

type Visited = 'X';

type AreaItem = GuardOrientation | Blank | Hazard | Visited;

type PatrolArea = Array<Array<AreaItem>>;

let patrol: PatrolArea = [];

type Position = {
  x: number;
  y: number;
};

let guardPosition: Position = {
  x: -1,
  y: -1,
};

// this will be the x and y joined as "x,y"
const visitedCoordinates = new Set<string>();

let inPatrolArea = true;

for (let y = 0; y<lines.length; y++) {
  const line = lines[y];
  const row: Array<AreaItem> = [];
  const chars = line.split('');

  for (let x = 0; x < chars.length; x++) {
    const char = chars[x];
    if (char === '^') {
      guardPosition.y = y;
      guardPosition.x = x;
    }

    if (char === '#') {
      row.push(char as Hazard);
    } else if (char === '.') {
      row.push(char as Blank);

    } else if (char === '^') {
      row.push(char as GuardOrientation);
    } else {
      throw new Error(`Unexpected character ${char}`);
    }
  }
  patrol.push(row);
}

// assert(patrol.length === 10, `map.length === 10, actually ${patrol.length}`);
// assert(patrol[0].length === 10, 'map[0].length === 10'); 

assert(guardPosition.x !== -1, `Guard x was not found`)
assert(guardPosition.y !== -1, `Guard y was not found`)

const patrolAreaWidth = patrol[0].length;
const patrolAreaHeight = patrol.length;


const assertGuardPosition = (patrol: PatrolArea, position: Position): GuardOrientation | null => {
  const charAtGuard: AreaItem = patrol[position.y][position.x];
  const isGuardChar = charAtGuard === '^' || charAtGuard === 'v' || charAtGuard === '<' || charAtGuard === '>';

  assert(isGuardChar, `Retrieved invalid guardchar at (${position.x},${position.y}), actually ${charAtGuard}`);

  return charAtGuard;
};

// just to be really pedantic and ensure we're starting in good state
assertGuardPosition(patrol, guardPosition);

// ok now we can start

const patchPatrol = (patrol: PatrolArea, position: Position, newChar: AreaItem) => {
  patrol[position.y][position.x] = newChar;
};

const moveGuardUp = (patrol: PatrolArea, position: Position): [PatrolArea, Position] => {
  const hazardOrNewOrientation = detectHazard(patrol, position, '^');

  if (hazardOrNewOrientation === false) {
    patchPatrol(patrol, position, '.');
    patchPatrol(patrol, { x: position.x, y: position.y - 1 }, '^');

    return [patrol, { x: position.x, y: position.y - 1 }];
  }  else if (hazardOrNewOrientation === null) {
    inPatrolArea = false
  } else {
    patchPatrol(patrol, position, hazardOrNewOrientation);
  }

  return [patrol, position];
};

const moveGuardRight = (patrol: PatrolArea, position: Position): [PatrolArea, Position] => {
  const hazardOrNewOrientation = detectHazard(patrol, position, '>');

  if (hazardOrNewOrientation === false) {
    patchPatrol(patrol, position, '.');
    patchPatrol(patrol, { x: position.x + 1, y: position.y }, '>');

    return [patrol, { x: position.x + 1, y: position.y }];
  }  else if (hazardOrNewOrientation === null) {
    inPatrolArea = false
  } else {
    patchPatrol(patrol, position, hazardOrNewOrientation);
  }

  return [patrol, position];
};

const moveGuardDown = (patrol: PatrolArea, position: Position): [PatrolArea, Position] => {
  const hazardOrNewOrientation = detectHazard(patrol, position, 'v');

  if (hazardOrNewOrientation === false) {
    patchPatrol(patrol, position, '.');
    patchPatrol(patrol, { x: position.x, y: position.y + 1 }, 'v');

    return [patrol, { x: position.x, y: position.y + 1 }];
  }  else if (hazardOrNewOrientation === null) {
    inPatrolArea = false
  } else {
    patchPatrol(patrol, position, hazardOrNewOrientation);
  }

  return [patrol, position];
};

const moveGuardLeft = (patrol: PatrolArea, position: Position): [PatrolArea, Position] => {
  const hazardOrNewOrientation = detectHazard(patrol, position, '<');

  if (hazardOrNewOrientation === false) {
    patchPatrol(patrol, position, '.');
    patchPatrol(patrol, { x: position.x - 1, y: position.y }, '<');

    return [patrol, { x: position.x - 1, y: position.y }];
  }  else if (hazardOrNewOrientation === null) {
    inPatrolArea = false
  } else {
    patchPatrol(patrol, position, hazardOrNewOrientation);
  }

  return [patrol, position];
};

const detectHazard = (patrol: PatrolArea, position: Position, guard: GuardOrientation): false | null | GuardOrientation => {
  switch(guard) {
    case '^': {
      if (position.y === 0) {
        return null;
      }

      const upwardChar = patrol[position.y - 1][position.x];
      if (upwardChar === '#') {
        return '>';
      } else if (upwardChar === '.') {
        return false;
      }

      throw new Error(`Unexpected char ${upwardChar}`);
    }
    case '>': {
      if (position.x === patrolAreaWidth - 1) {
        return null;
      }

      const rightwardChar = patrol[position.y][position.x + 1];
      if (rightwardChar === '#') {
        return 'v';
      } else if (rightwardChar === '.') {
        return false;
      }

      throw new Error(`Unexpected char ${rightwardChar}`);
    }
    case 'v': {
      if (position.y === patrolAreaHeight - 1) {
        return null;
      }

      const downwardChar = patrol[position.y + 1][position.x];
      if (downwardChar === '#') {
        return '<';
      } else if (downwardChar === '.') {
        return false;
      }

      throw new Error(`Unexpected char ${downwardChar}`);
    }
    case '<': {
      if (position.x === 0) {
        return null;
      }

      const leftwardChar = patrol[position.y][position.x - 1];
      if (leftwardChar === '#') {
        return '^';
      } else if (leftwardChar === '.') {
        return false
      }

      throw new Error(`Unexpected char ${leftwardChar}`);
    }
    default: {
      throw new Error(`Unexpected guard orientation ${guard}`);
    }
  }
};


const advanceGuard = (patrol: PatrolArea, position: Position): [PatrolArea, Position] => {
  // capture the guards current position
  const capturedPosition = `${position.x},${position.y}`;
  visitedCoordinates.add(capturedPosition);

  const charAtGuard = assertGuardPosition(patrol, position);

  switch (charAtGuard) {
    case '^':
      return moveGuardUp(patrol, position);
    case '>':
      return moveGuardRight(patrol, position);
    case 'v':
      return moveGuardDown(patrol, position);
    case '<':
      return moveGuardLeft(patrol, position);
    default: {
      throw new Error(`Unexpected char at expected position ${charAtGuard}`);
    }
  }
};



while (inPatrolArea) {
  // advance the guard
  const result = advanceGuard(patrol, guardPosition);

  patrol = result[0];
  guardPosition = result[1];
}

console.log(visitedCoordinates.size)