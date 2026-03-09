import React from "react";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import type { SimulationStep } from "@/lib/bankersAlgorithm";

interface SimulationVisualProps {
  steps: SimulationStep[];
  safe: boolean;
  safeSequence: number[];
  resources: number;
}

const SimulationVisual: React.FC<SimulationVisualProps> = ({
  steps,
  safe,
  safeSequence,
  resources,
}) => {
  const executedSteps = steps.filter((s) => s.canExecute);

  return (
    <div className="section-card space-y-6">
      {/* Status Banner */}
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
          safe
            ? "bg-green-500/10 border-green-500/50"
            : "bg-red-500/10 border-red-500/50"
        }`}
      >
        {safe ? (
          <>
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="font-heading font-bold text-green-400">Safe State</h3>
              <p className="text-sm text-green-300/80">
                System is in a safe state. Deadlock can be avoided.
              </p>
            </div>
          </>
        ) : (
          <>
            <XCircle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="font-heading font-bold text-red-400">Unsafe State</h3>
              <p className="text-sm text-red-300/80">
                System is NOT in a safe state. Potential deadlock detected.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Safe Sequence */}
      {safe && safeSequence.length > 0 && (
        <div>
          <h4 className="font-heading font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">
            Safe Sequence
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            {safeSequence.map((p, idx) => (
              <React.Fragment key={idx}>
                <div className="px-3 py-1.5 rounded-md bg-primary/20 border border-primary/40 font-mono text-sm text-primary font-semibold">
                  P{p}
                </div>
                {idx < safeSequence.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Execution Steps */}
      {executedSteps.length > 0 && (
        <div>
          <h4 className="font-heading font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">
            Execution Steps
          </h4>
          <div className="space-y-3">
            {executedSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-accent/30 border border-border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-primary">
                    Step {idx + 1}: Process P{step.process}
                  </span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-muted-foreground">Need:</span>{" "}
                    <span className="text-foreground">
                      [{step.need.join(", ")}]
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available:</span>{" "}
                    <span className="text-foreground">
                      [{step.available.join(", ")}]
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Allocated:</span>{" "}
                    <span className="text-foreground">
                      [{step.allocated.join(", ")}]
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationVisual;
