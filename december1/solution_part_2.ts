// https://adventofcode.com/2024/day/1#part2

import assert from 'node:assert';

// https://adventofcode.com/2024/day/1/input
const file = Deno.openSync('./1/input.txt');

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

let similarity = 0;

for (let i = 0; i < sortedLeft.length; i++) {
  const leftNum = sortedLeft[i];

  let instancesInRight = 0;

  for (let j = 0; j < sortedRight.length; j++) {
    const rightNum = sortedRight[j];

    if (leftNum === rightNum) {
      instancesInRight++;
    }

    // since the lists are sorted, we can break early
    // and save on checking the rest of the list
    if (rightNum > leftNum) {
      break;
    }
  }

  similarity += leftNum * instancesInRight
}

console.log(similarity);