// https://adventofcode.com/2024/day/7

import assert from "node:assert";

// https://adventofcode.com/2024/day/7/input
const file = Deno.openSync('./december7/input.txt');

const buffer = new Uint8Array(file.statSync().size);

file.readSync(buffer);

const text = new TextDecoder().decode(buffer);

const lines = text.trim().split('\n');

type Problem = {
  result: number;
  operands: Array<number>; 
};

type EquationArgument = ['+' | '*' | '=', number];

type Equation = Array<EquationArgument>;

type ProblemTest = {
  result: number;
  equation: Equation;
};

const parseProblem = (line: string): Problem => {
  const parts = line.split(':');
  const result = parseInt(parts[0], 10);
  const operands: Array<number> = [];

  if (parts[1]) {
    const operandsText = parts[1].trim().split(' ');
    for (const operandText of operandsText) {
      const operand = parseInt(operandText, 10);
      operands.push(operand);
    }
  } else {
    throw new Error(`Invalid problem: ${line}`);
  }

  return {
    result: result,
    operands,
  }
};

const problems: Array<Problem> = [];

for (const line of lines) {
  const problem = parseProblem(line);
  problems.push(problem);
}

assert(problems.length === 9 || problems.length === 850, "There should be 9 or 850 problems");

const solveProblem = (problem: ProblemTest): boolean => {
  let result = 0;

  // we are not following PEMDAS, we're doing left to right evaluation
  for (const [operator, operand] of problem.equation) {
    if (result === 0 && operator !== '=') {
      throw new Error(`Invalid equation: ${problem.equation.join(', ')}`);
    }
    
    if (result === 0 && operator === '=') {
      result = operand;
      continue;
    }

    if (operator === '+') {
      result += operand;
    } else if (operator === '*') {
      result *= operand;
    }

    // if we exceed the result, we can stop as we know we it's wrong
    if (result > problem.result) {
      return false;
    }
  }

  return result === problem.result;
}

assert(solveProblem({ result: 6, equation: [['=', 2], ['*', 2], ['+', 2]] }), "Test failed, expected 6");
assert(solveProblem({ result: 1, equation: [['=', 1], ['*', 1], ['*', 1]] }), "Test failed, expected 1");
assert(solveProblem({ result: 4, equation: [['=', 1], ['+', 1], ['+', 1], ['+', 1]] }), "Test failed, expected 4");
assert(solveProblem({ result: 190, equation: [['=', 10], ['*', 19]] }), "Test failed, expected 190");
// 3267: 81+40*27
assert(solveProblem({ result: 3267, equation: [['=', 81], ['+', 40], ['*', 27]] }), "Test failed, expected 3267");
// 3267: 81*40+27
assert(solveProblem({ result: 3267, equation: [['=', 81], ['*', 40], ['+', 27]] }), "Test failed, expected 3267");

const allMultiply = (problem: Problem): boolean => {
  const problemTestArguments: Array<EquationArgument> = problem.operands.map((operand, index) => {
    if (index === 0) {
      return ['=', operand]
    } else {
      return ['*', operand]
    }
  })

  return solveProblem({ result: problem.result, equation: problemTestArguments});
};

const allSum = (problem: Problem): boolean => {
  const problemTestArguments: Array<EquationArgument> = problem.operands.map((operand, index) => {
    if (index === 0) {
      return ['=', operand]
    } else {
      return ['+', operand]
    }
  })

  return solveProblem({ result: problem.result, equation: problemTestArguments});
}

const alternateMultiply1 = (problem: Problem): boolean => {
  const problemTestArguments: Array<EquationArgument> = problem.operands.map((operand, index) => {
    if (index === 0) {
      return ['=', operand]
    } else if (index % 2 === 0) {
      return ['+', operand]
    } else {
      return ['*', operand]
    }
  })

  return solveProblem({ result: problem.result, equation: problemTestArguments});
}

const alternateMultiply2 = (problem: Problem): boolean => {
  const problemTestArguments: Array<EquationArgument> = problem.operands.map((operand, index) => {
    if (index === 0) {
      return ['=', operand]
    } else if (index % 2 === 0) {
      return ['*', operand]
    } else {
      return ['+', operand]
    }
  })

  return solveProblem({ result: problem.result, equation: problemTestArguments});
}


const produceEquations = (operands: Array<number>): Array<Equation> => {
  const equationList: Array<Equation> = [];

  // produce every iteration of the operands
  // the possible operands are + and *
  // the first operand is always =
  // for any list of numbers there would be 2^(n-1) possible equations
  // where n is the number of operands

  const n = operands.length;
  const total = 2 ** (n - 1);

  for (let i = 0; i < total; i++) {
    const equation: Equation = [];

    for (let j = 0; j < n; j++) {
      if (j === 0) {
        equation.push(['=', operands[j]]);
      } else {
        const operator = (i & (1 << (j - 1))) ? '*' : '+';
        equation.push([operator, operands[j]]);
      }
    }

    equationList.push(equation);
  }

  return equationList;
}

const iterateAllPosibleOperators = (problem: Problem): boolean => {
  const equations = produceEquations(problem.operands);

  for (const equation of equations) {
    if (solveProblem({ result: problem.result, equation })) {
      return true;
    }
  }

  return false;
};

const validProblems: Array<Problem> = [];

for (const problem of problems) {
  const multiplyResult = allMultiply(problem);

  if (multiplyResult) {
    validProblems.push(problem);
    continue;
  }

  const sumResult = allSum(problem);

  if (sumResult) {
    validProblems.push(problem);
    continue;
  }

  const alternateMultiply1Result = alternateMultiply1(problem);

  if (alternateMultiply1Result) {
    validProblems.push(problem);
    continue;
  }

  const alternateMultiply2Result = alternateMultiply2(problem);

  if (alternateMultiply2Result) {
    validProblems.push(problem);
    continue;
  }

  const finalResult = iterateAllPosibleOperators(problem);

  if (finalResult) {
    validProblems.push(problem);
  }
}

console.log(`Valid problems: ${validProblems.length}`);
//console.log(validProblems.map(problem => problem.result).join(', '));

const sumOfValidProblems = validProblems.reduce((acc, problem) => acc + problem.result, 0);

console.log(`Sum of valid problems: ${sumOfValidProblems}`);