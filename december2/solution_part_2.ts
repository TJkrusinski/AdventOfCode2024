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

const allIncreasing = (nums: Array<number>, spliceIndex?: number): boolean => {
  if (spliceIndex !== undefined) {
    nums.splice(spliceIndex, 1);
  }

  // return true if all of the numbers are increasing
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] >= nums[i + 1]) {
      if (spliceIndex === undefined) {
        return allIncreasing(nums, i + 1);
      } else {
        return false;
      }
    }
  }

  return true;
};

const allDecreasing = (nums: Array<number>, spliceIndex?: number): boolean => {
  if (spliceIndex !== undefined) {
    nums.splice(spliceIndex, 1);
  }

  // return true if all of the numbers are decreasing
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] <= nums[i + 1]) {
      if (spliceIndex === undefined) {
        return allDecreasing(nums, i + 1);
      } else {
        return false;
      }
    }
  }

  return true;
};

const hasMinimalVariance = (nums: Array<number>, canRetry: boolean): boolean => {

  for (let i = 0; i < nums.length - 1; i++) {
    const diff = Math.abs(nums[i] - nums[i + 1]);

    if (diff < 1 || diff > 3) {
      if (canRetry) {
        nums.splice(i+1, 1);
        return hasMinimalVariance(nums, false);
      } else {
        return false;
      }
    }
  }

  return true;
};

let numSafe = 0;

for (let i = 0; i < matrix.length; i++) {
  const row = matrix[i];
  const increaseCopy = row.slice();
  const decreaseCopy = row.slice();

  const increaseResult = allIncreasing(increaseCopy);
  const decreaseResult = allDecreasing(decreaseCopy);

  if (increaseResult && row.join('') !== increaseCopy.join('')) {
    // we can try the hasMinimalVariance function once
    const result = hasMinimalVariance(increaseCopy, false);
    if (result) {
      numSafe++;
    }
  } else if (decreaseResult && row.join('') !== decreaseCopy.join('')) {
    // we can try the hasMinimalVariance function once
    const result = hasMinimalVariance(decreaseCopy, false);
    if (result) {
      numSafe++;
    }
  } else if (increaseResult || decreaseResult) {
    const result = hasMinimalVariance(row, true);
    if (result) {
      numSafe++;
    }
  }
}

console.log(numSafe);
