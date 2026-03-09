import React, { useState, useMemo, useCallback } from "react";
import MatrixInput from "@/components/MatrixInput";
import SimulationVisual from "@/components/SimulationVisual";
import { runBankersAlgorithm, computeNeedMatrix, type BankerResult } from "@/lib/bankersAlgorithm";
import { Play, RotateCcw, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

const createMatrix = (rows: number, cols: number, fill = 0) =>
  Array.from({ length: rows }, () => new Array(cols).fill(fill));

const App = () => {
  const [processes, setProcesses] = useState(5);
  const [resources, setResources] = useState(3);
  const [allocation, setAllocation] = useState(() => [
    [0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2],
  ]);
  const [maximum, setMaximum] = useState(() => [
    [7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3],
  ]);
  const [available, setAvailable] = useState(() => [3, 3, 2]);
  const [result, setResult] = useState<BankerResult | null>(null);

  const needMatrix = useMemo(() => computeNeedMatrix(allocation, maximum), [allocation, maximum]);

  const updateDimensions = useCallback((p: number, r: number) => {
    setProcesses(p);
    setResources(r);
    setAllocation(createMatrix(p, r));
    setMaximum(createMatrix(p, r));
    setAvailable(new Array(r).fill(0));
    setResult(null);
  }, []);

  const updateMatrix = (
    setter: React.Dispatch<React.SetStateAction<number[][]>>,
    row: number,
    col: number,
    value: number
  ) => {
    setter((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });
    setResult(null);
  };

  const runAlgorithm = () => {
    const res = runBankersAlgorithm({ processes, resources, allocation, maximum, available });
    setResult(res);
  };

  const reset = () => {
    setAllocation(createMatrix(processes, resources));
    setMaximum(createMatrix(processes, resources));
    setAvailable(new Array(resources).fill(0));
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-foreground">Banker's Algorithm</h1>
            <p className="text-xs text-muted-foreground">Deadlock Avoidance Simulator</p>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Config */}
        <div className="section-card flex flex-wrap gap-6 items-end">
          <div>
            <label className="text-xs font-heading font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
              Processes
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={processes}
              onChange={(e) => updateDimensions(Math.min(10, Math.max(1, +e.target.value || 1)), resources)}
              className="matrix-cell w-20 h-9 px-2"
            />
          </div>
          <div>
            <label className="text-xs font-heading font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
              Resources
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={resources}
              onChange={(e) => updateDimensions(processes, Math.min(10, Math.max(1, +e.target.value || 1)))}
              className="matrix-cell w-20 h-9 px-2"
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <Button onClick={reset} variant="outline" size="sm" className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
            <Button onClick={runAlgorithm} size="sm" className="gap-1.5 animate-pulse-glow">
              <Play className="w-3.5 h-3.5" /> Run Algorithm
            </Button>
          </div>
        </div>

        {/* Matrices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MatrixInput
            title="Allocation Matrix"
            rows={processes}
            cols={resources}
            data={allocation}
            onChange={(r, c, v) => updateMatrix(setAllocation, r, c, v)}
          />
          <MatrixInput
            title="Maximum Matrix"
            rows={processes}
            cols={resources}
            data={maximum}
            onChange={(r, c, v) => updateMatrix(setMaximum, r, c, v)}
          />
          <MatrixInput
            title="Need Matrix (Auto)"
            rows={processes}
            cols={resources}
            data={needMatrix}
            onChange={() => {}}
            readOnly
            variant="need"
            highlightRow={result?.steps[result.steps.length - 1]?.process}
          />

          {/* Available */}
          <div className="section-card">
            <h3 className="font-heading font-semibold text-sm mb-3 tracking-wide uppercase text-muted-foreground">
              Available Resources
            </h3>
            <div className="flex gap-2">
              {available.map((v, j) => (
                <div key={j} className="flex flex-col items-center gap-1">
                  <span className="text-xs font-mono text-primary">R{j}</span>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={v}
                    onChange={(e) => {
                      const next = [...available];
                      next[j] = Math.max(0, parseInt(e.target.value) || 0);
                      setAvailable(next);
                      setResult(null);
                    }}
                    className="matrix-cell w-12 h-8 px-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <SimulationVisual
            steps={result.steps}
            safe={result.safe}
            safeSequence={result.safeSequence}
            resources={resources}
          />
        )}
      </main>
    </div>
  );
};

export default App;
