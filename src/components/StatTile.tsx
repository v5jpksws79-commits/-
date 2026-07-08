interface Props {
  label: string;
  value: string;
  colorVar: string;
}

export function StatTile({ label, value, colorVar }: Props) {
  return (
    <div className="stat-tile">
      <span className="stat-tile-swatch" style={{ backgroundColor: `var(${colorVar})` }} />
      <span className="stat-tile-value">{value}</span>
      <span className="stat-tile-label">{label}</span>
    </div>
  );
}
