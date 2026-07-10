import { useMemo, useState } from 'react';
import { average, buildDailyStats, sum } from '../lib/aggregate';
import type { DiaryEntry } from '../lib/types';
import { BarChart } from './BarChart';
import { StatTile } from './StatTile';

interface Props {
  entries: Record<string, DiaryEntry>;
}

const RANGE_OPTIONS = [7, 14, 30] as const;

export function StatsView({ entries }: Props) {
  const [range, setRange] = useState<(typeof RANGE_OPTIONS)[number]>(7);
  const stats = useMemo(() => buildDailyStats(entries, range), [entries, range]);

  const hasAnyEntry = Object.keys(entries).length > 0;
  if (!hasAnyEntry) {
    return <p className="empty-state">まだ記録がありません。「記録」タブから今日の日記を書いてみましょう。</p>;
  }

  return (
    <div className="stats-view">
      <div className="range-picker">
        {RANGE_OPTIONS.map((r) => (
          <button
            key={r}
            className={r === range ? 'range-btn active' : 'range-btn'}
            onClick={() => setRange(r)}
          >
            直近{r}日間
          </button>
        ))}
      </div>

      <div className="stat-tiles">
        <StatTile label="支出合計" value={`${sum(stats.spending).toLocaleString()}円`} colorVar="--series-1" />
        <StatTile label="運動合計" value={`${sum(stats.exerciseMin).toLocaleString()}分`} colorVar="--series-2" />
        <StatTile label="平均睡眠時間" value={`${average(stats.sleepHours).toFixed(1)}時間`} colorVar="--series-8" />
        <StatTile label="食事記録数" value={`${sum(stats.mealCount).toLocaleString()}件`} colorVar="--series-4" />
        <StatTile label="平均摂取カロリー(目安)" value={`${Math.round(average(stats.calorieKcal)).toLocaleString()}kcal`} colorVar="--series-3" />
      </div>

      <section className="chart-section">
        <h3>日別支出</h3>
        <BarChart data={stats.spending} colorVar="--series-1" unit="円" />
      </section>

      <section className="chart-section">
        <h3>日別運動時間</h3>
        <BarChart data={stats.exerciseMin} colorVar="--series-2" unit="分" />
      </section>

      <section className="chart-section">
        <h3>日別睡眠時間</h3>
        <BarChart data={stats.sleepHours} colorVar="--series-8" unit="時間" />
      </section>

      <section className="chart-section">
        <h3>日別摂取カロリー(目安)</h3>
        <BarChart data={stats.calorieKcal} colorVar="--series-3" unit="kcal" />
      </section>
    </div>
  );
}
