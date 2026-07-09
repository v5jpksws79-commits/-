import { addDays, formatDateJa, todayKey } from './date';
import { parseDiaryText } from './parseDiary';
import type { DiaryEntry } from './types';

export interface DailyPoint {
  date: string;
  label: string;
  value: number;
}

export interface DailyStats {
  spending: DailyPoint[];
  exerciseMin: DailyPoint[];
  sleepHours: DailyPoint[];
  mealCount: DailyPoint[];
  calorieKcal: DailyPoint[];
}

export function buildDailyStats(entries: Record<string, DiaryEntry>, days: number): DailyStats {
  const today = todayKey();
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(addDays(today, -i));
  }

  const spending: DailyPoint[] = [];
  const exerciseMin: DailyPoint[] = [];
  const sleepHours: DailyPoint[] = [];
  const mealCount: DailyPoint[] = [];
  const calorieKcal: DailyPoint[] = [];

  for (const date of dates) {
    const entry = entries[date];
    const parsed = entry ? parseDiaryText(entry.text) : { spending: [], meals: [], exercises: [], sleep: [], schedule: [] };
    const label = formatDateJa(date).replace(/\(.*\)/, '');
    spending.push({ date, label, value: parsed.spending.reduce((s, x) => s + x.amount, 0) });
    exerciseMin.push({ date, label, value: parsed.exercises.reduce((s, x) => s + (x.durationMin ?? 0), 0) });
    sleepHours.push({ date, label, value: parsed.sleep.reduce((s, x) => s + (x.hours ?? 0), 0) });
    mealCount.push({ date, label, value: parsed.meals.length });
    calorieKcal.push({ date, label, value: parsed.meals.reduce((s, x) => s + (x.kcal ?? 0), 0) });
  }

  return { spending, exerciseMin, sleepHours, mealCount, calorieKcal };
}

export function sum(points: DailyPoint[]): number {
  return points.reduce((s, p) => s + p.value, 0);
}

export function average(points: DailyPoint[]): number {
  const recorded = points.filter((p) => p.value > 0);
  if (!recorded.length) return 0;
  return sum(recorded) / recorded.length;
}
