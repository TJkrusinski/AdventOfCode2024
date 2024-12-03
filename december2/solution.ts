// https://adventofcode.com/2024/day/2

// https://adventofcode.com/2024/day/2/input
const file = Deno.openSync('./december2/input.txt');

const buffer = new Uint8Array(file.statSync().size);

file.readSync(buffer);

const text = new TextDecoder().decode(buffer);

const lines = text.split('\n');

const matrix: Array<Array<number>> = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const split = line.split(' ');

  const row: Array<number> = [];

  for (let j = 0; j < split.length; j++) {
    row.push(parseInt(split[j]));
  }

  matrix.push(row);
}

const allIncreasing = (nums: Array<number>): boolean => {
  // return true if all of the numbers are increasing
  for (let i = 0; i < nums.length - 1; i++) {
    if (!(nums[i] < nums[i + 1])) {
      return false;
    }
  }

  return true;
};

const allDecreasing = (nums: Array<number>): boolean => {
  // return true if all of the numbers are decreasing
  for (let i = 0; i < nums.length - 1; i++) {
    if (!(nums[i] > nums[i + 1])) {
      return false;
    }
  }

  return true;
};

const hasMinimalVariance = (nums: Array<number>, takeAwayIndex?: number): boolean => {

  if (takeAwayIndex !== undefined) {
    nums.splice(takeAwayIndex, 1);
  }

  for (let i = 0; i < nums.length - 1; i++) {
    const current = nums[i];
    const next = nums[i + 1];

    if (next) {
      const diff = Math.abs(current - next);

      if (diff < 1 || diff > 3) {
        return false;
      }
    }
  }

  return true;
};

let numSafe = 0;

for (let i = 0; i < matrix.length; i++) {
  const row = matrix[i];

  if (allIncreasing(row) || allDecreasing(row)) {
    if (hasMinimalVariance(row)) {
      numSafe++;
    }
  }
}

console.log(numSafe);
