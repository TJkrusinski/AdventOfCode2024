// https://adventofcode.com/2024/day/5

import assert from "node:assert";

// https://adventofcode.com/2024/day/5/input
const file = Deno.openSync('./december5/input.txt');

const buffer = new Uint8Array(file.statSync().size);

file.readSync(buffer);

const text = new TextDecoder().decode(buffer);

const lines = text.trim().split('\n');

type Rule = [number, number];

const rules: Array<Rule> = [];
const updates: Array<Array<number>> = [];

for (const line of lines) {
  if (line.trim() !== '') {
    if (line.indexOf('|') !== -1) {
      const [first, second] = line.split('|');
      rules.push([parseInt(first), parseInt(second)]);
    } else {
      const nums = line.split(',').map(Number);
      updates.push(nums);
    }
  }
}

assert(rules.length === 1176, `Invalid number of rules, got ${rules.length}`);
assert(updates.length === 193, "Invalid number of updates");

const validUpdates: Array<Array<number>> = [];

const updateIsValid = (update: Array<number>, rules: Array<Rule>): boolean => {
  let valid = true;
  for (const rule of rules) {
    const indexOfFirstRule = update.indexOf(rule[0]);
    const indexOfSecondRule = update.indexOf(rule[1]);

    if (indexOfFirstRule > indexOfSecondRule) {
      valid = false;
      break;
    }
  }

  return valid;
};

const ruleIsApplicable = (update: Array<number>, rule: Rule): boolean => {
  // we need to see that both parts of the rule are members of the update array
  if (update.indexOf(rule[0]) !== -1 && update.indexOf(rule[1]) !== -1) {
    return true;
  }
  return false;
};

for (const update of updates) {
  const applicableRules = rules.filter(rule => {
    return ruleIsApplicable(update, rule);
  });

  if (updateIsValid(update, applicableRules)) {
    validUpdates.push(update);
  }
}

const getMiddleElement = (arr: Array<number>): number => {
  return arr[Math.floor(arr.length / 2)];
}

const total = validUpdates.reduce((acc, update) => {
  return acc + getMiddleElement(update);
}, 0);

console.log(total);