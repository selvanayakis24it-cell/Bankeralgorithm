export interface SimulationStep {
  process: number;
  available: number[];
  allocated: number[];
  need: number[];
  canExecute: boolean;
}

export interface BankerResult {
  safe: boolean;
  safeSequence: number[];
  steps: SimulationStep[];
}

export interface BankerInput {
  processes: number;
  resources: number;
  allocation: number[][];
  maximum: number[][];
  available: number[];
}

export function computeNeedMatrix(allocation: number[][], maximum: number[][]): number[][] {
  return allocation.map((row, i) =>
    row.map((val, j) => Math.max(0, maximum[i][j] - val))
  );
}

export function runBankersAlgorithm(input: BankerInput): BankerResult {
  const { processes, resources, allocation, maximum, available } = input;
  
  const need = computeNeedMatrix(allocation, maximum);
  const work = [...available];
  const finish = new Array(processes).fill(false);
  const safeSequence: number[] = [];
  const steps: SimulationStep[] = [];

  let foundProcess = true;

  while (foundProcess && safeSequence.length < processes) {
    foundProcess = false;

    for (let i = 0; i < processes; i++) {
      if (finish[i]) continue;

      const canExecute = need[i].every((needVal, j) => needVal <= work[j]);

      steps.push({
        process: i,
        available: [...work],
        allocated: [...allocation[i]],
        need: [...need[i]],
        canExecute,
      });

      if (canExecute) {
        // Process can execute
        for (let j = 0; j < resources; j++) {
          work[j] += allocation[i][j];
        }
        finish[i] = true;
        safeSequence.push(i);
        foundProcess = true;
        break;
      }
    }
  }

  const safe = safeSequence.length === processes;

  return {
    safe,
    safeSequence,
    steps,
  };
}
