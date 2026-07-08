export interface DiaryEntry {
  date: string; // YYYY-MM-DD
  text: string;
  updatedAt: string; // ISO timestamp
}

export interface SpendingItem {
  amount: number;
  category?: string;
  memo: string;
  time?: string;
}

export interface MealItem {
  mealType?: string;
  content: string;
  time?: string;
  kcal?: number;
}

export interface ExerciseItem {
  type: string;
  durationMin?: number;
  time?: string;
}

export interface PhoneUsageItem {
  app: string;
  durationMin?: number;
  time?: string;
}

export interface ScheduleItem {
  time?: string;
  endTime?: string;
  content: string;
}

export interface ParsedDay {
  spending: SpendingItem[];
  meals: MealItem[];
  exercises: ExerciseItem[];
  phoneUsage: PhoneUsageItem[];
  schedule: ScheduleItem[];
}
