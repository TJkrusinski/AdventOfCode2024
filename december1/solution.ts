// https://adventofcode.com/2024/day/1

import assert from 'node:assert';

// https://adventofcode.com/2024/day/1/input
const file = Deno.openSync('./december1/input.txt');

const buffer = new Uint8Array(file.statSync().size);

file.readSync(buffer);

const text = new TextDecoder().decode(buffer);

const lines = text.split('\n');

const left: Array<number> = [];
const right: Array<number> = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const split = line.split('   ');

  const firstNum = parseInt(split[0]);
  const secondNum = parseInt(split[1]);

  left.push(firstNum);
  right.push(secondNum);
}

assert(left.length === right.length);
assert(left.length === lines.length);

const sortedLeft = left.sort((a, b) => a - b);
const sortedRight = right.sort((a, b) => a - b);

let total = 0;

assert(sortedLeft[0] < sortedLeft[sortedLeft.length - 1], 'not sorted?');

for (let i = 0; i < sortedLeft.length; i++) {
  const leftNum = sortedLeft[i];
  const rightNum = sortedRight[i];

  if (leftNum > rightNum) {
    total += leftNum - rightNum;
  } else {
    total += rightNum - leftNum;
  }
}

console.log(total);