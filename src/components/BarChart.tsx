import type { DailyPoint } from '../lib/aggregate';

interface Props {
  data: DailyPoint[];
  colorVar: string;
  unit?: string;
  height?: number;
}

export function BarChart({ data, colorVar, unit = '', height = 160 }: Props) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="bar-chart">
      <div className="bar-chart-plot" style={{ height }}>
        {data.map((d) => {
          const barHeightPct = (d.value / max) * 100;
          return (
            <div className="bar-chart-col" key={d.date}>
              {d.value > 0 && <span className="bar-chart-value">{d.value.toLocaleString()}</span>}
              <div
                className="bar-chart-bar"
                style={{
                  height: `${Math.max(barHeightPct, d.value > 0 ? 2 : 0)}%`,
                  backgroundColor: `var(${colorVar})`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="bar-chart-labels">
        {data.map((d) => (
          <span key={d.date}>{d.label}</span>
        ))}
      </div>
      {unit && <div className="bar-chart-unit">単位: {unit}</div>}
    </div>
  );
}
