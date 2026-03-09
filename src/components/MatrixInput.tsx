import React from "react";

interface MatrixInputProps {
  title: string;
  rows: number;
  cols: number;
  data: number[][];
  onChange: (row: number, col: number, value: number) => void;
  readOnly?: boolean;
  variant?: "default" | "need";
  highlightRow?: number;
}

const MatrixInput: React.FC<MatrixInputProps> = ({
  title,
  rows,
  cols,
  data,
  onChange,
  readOnly = false,
  variant = "default",
  highlightRow,
}) => {
  return (
    <div className="section-card">
      <h3 className="font-heading font-semibold text-sm mb-3 tracking-wide uppercase text-muted-foreground">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-xs font-mono text-muted-foreground pb-2 pr-2"></th>
              {Array.from({ length: cols }, (_, j) => (
                <th key={j} className="text-xs font-mono text-primary pb-2 px-1">
                  R{j}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, i) => (
              <tr
                key={i}
                className={
                  highlightRow === i
                    ? "bg-primary/10 border-l-2 border-primary"
                    : ""
                }
              >
                <td className="text-xs font-mono text-primary pr-2 py-1">P{i}</td>
                {Array.from({ length: cols }, (_, j) => (
                  <td key={j} className="px-1 py-1">
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={data[i]?.[j] ?? 0}
                      onChange={(e) => {
                        if (!readOnly) {
                          const val = Math.max(0, parseInt(e.target.value) || 0);
                          onChange(i, j, val);
                        }
                      }}
                      readOnly={readOnly}
                      className={`matrix-cell w-12 h-8 px-1 ${
                        readOnly ? "bg-muted/30 cursor-not-allowed" : ""
                      } ${variant === "need" ? "text-accent-foreground" : ""}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatrixInput;
