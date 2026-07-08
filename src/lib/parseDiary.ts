import type {
  ExerciseItem,
  MealItem,
  ParsedDay,
  PhoneUsageItem,
  ScheduleItem,
  SpendingItem,
} from './types';

const TIME_LINE_RE = /^\s*(\d{1,2}:\d{2})(?:\s*[-〜~]\s*(\d{1,2}:\d{2}))?\s+(.*)$/;
const MEAL_TYPES = ['朝食', '昼食', '夕食', '間食', '夜食'];

function extractPayload(line: string, tag: string): string {
  const idx = line.indexOf(tag);
  let rest = line.slice(idx + tag.length);
  const nextTagIdx = rest.search(/#\S+/);
  if (nextTagIdx !== -1) rest = rest.slice(0, nextTagIdx);
  return rest.trim();
}

function extractDuration(payload: string): { durationMin?: number; rest: string } {
  const match = payload.match(/([0-9]+)\s*分/);
  if (!match) return { durationMin: undefined, rest: payload.trim() };
  return {
    durationMin: Number(match[1]),
    rest: (payload.slice(0, match.index) + payload.slice((match.index ?? 0) + match[0].length)).trim(),
  };
}

export function parseDiaryText(text: string): ParsedDay {
  const spending: SpendingItem[] = [];
  const meals: MealItem[] = [];
  const exercises: ExerciseItem[] = [];
  const phoneUsage: PhoneUsageItem[] = [];
  const schedule: ScheduleItem[] = [];

  const lines = text.split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const timeMatch = line.match(TIME_LINE_RE);

    if (timeMatch && !line.includes('#')) {
      schedule.push({
        time: timeMatch[1],
        endTime: timeMatch[2] || undefined,
        content: timeMatch[3].trim(),
      });
      continue;
    }

    if (line.includes('#支出')) {
      const payload = extractPayload(line, '#支出');
      const amountMatch = payload.match(/[¥￥]?\s*([0-9,]+)\s*円?/);
      const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : 0;
      let memo = amountMatch
        ? (payload.slice(0, amountMatch.index) + payload.slice((amountMatch.index ?? 0) + amountMatch[0].length)).trim()
        : payload;
      let category: string | undefined;
      const catMatch = memo.match(/^([^\s:：]+)[:：]\s*(.*)$/);
      if (catMatch) {
        category = catMatch[1];
        memo = catMatch[2];
      }
      spending.push({ amount, category, memo, time: timeMatch?.[1] });
    }

    if (line.includes('#食事')) {
      const payload = extractPayload(line, '#食事');
      let mealType: string | undefined;
      let content = payload;
      for (const mt of MEAL_TYPES) {
        if (payload.startsWith(mt)) {
          mealType = mt;
          content = payload.slice(mt.length).trim();
          break;
        }
      }
      meals.push({ mealType, content, time: timeMatch?.[1] });
    }

    if (line.includes('#運動')) {
      const payload = extractPayload(line, '#運動');
      const { durationMin, rest } = extractDuration(payload);
      exercises.push({ type: rest, durationMin, time: timeMatch?.[1] });
    }

    if (line.includes('#スマホ')) {
      const payload = extractPayload(line, '#スマホ');
      const { durationMin, rest } = extractDuration(payload);
      phoneUsage.push({ app: rest, durationMin, time: timeMatch?.[1] });
    }

    if (line.includes('#予定')) {
      const payload = extractPayload(line, '#予定');
      schedule.push({
        time: timeMatch?.[1],
        endTime: timeMatch?.[2] || undefined,
        content: payload,
      });
    }
  }

  return { spending, meals, exercises, phoneUsage, schedule };
}
