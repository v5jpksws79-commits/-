import { describe, expect, it } from 'vitest';
import { parseDiaryText } from './parseDiary';

describe('parseDiaryText', () => {
  it('extracts schedule from time-prefixed lines without tags', () => {
    const result = parseDiaryText('7:00 起床\n9:00-18:00 仕事');
    expect(result.schedule).toEqual([
      { time: '7:00', endTime: undefined, content: '起床' },
      { time: '9:00', endTime: '18:00', content: '仕事' },
    ]);
  });

  it('extracts spending with amount, category and memo', () => {
    const result = parseDiaryText('12:30 ランチ #支出 食費: 800円 定食');
    expect(result.spending).toEqual([
      { amount: 800, category: '食費', memo: '定食', time: '12:30' },
    ]);
  });

  it('extracts spending without category', () => {
    const result = parseDiaryText('#支出 500円 コンビニでお菓子');
    expect(result.spending).toEqual([
      { amount: 500, category: undefined, memo: 'コンビニでお菓子', time: undefined },
    ]);
  });

  it('extracts meals with meal type', () => {
    const result = parseDiaryText('7:30 #食事 朝食 パンとコーヒー');
    expect(result.meals).toEqual([
      { mealType: '朝食', content: 'パンとコーヒー', time: '7:30' },
    ]);
  });

  it('extracts kcal annotation from meal content', () => {
    const result = parseDiaryText('11:00 #食事 昼食 パスタ (約800kcal)');
    expect(result.meals).toEqual([
      { mealType: '昼食', content: 'パスタ (約800kcal)', time: '11:00', kcal: 800 },
    ]);
  });

  it('leaves kcal undefined when no annotation is present', () => {
    const result = parseDiaryText('#食事 朝食 パンとコーヒー');
    expect(result.meals[0].kcal).toBeUndefined();
  });

  it('extracts exercise with duration', () => {
    const result = parseDiaryText('19:00 #運動 ランニング 30分');
    expect(result.exercises).toEqual([
      { type: 'ランニング', durationMin: 30, time: '19:00' },
    ]);
  });

  it('extracts phone usage with app and duration', () => {
    const result = parseDiaryText('21:00 #スマホ YouTube 45分');
    expect(result.phoneUsage).toEqual([
      { app: 'YouTube', durationMin: 45, time: '21:00' },
    ]);
  });

  it('extracts explicit #予定 tag with time range', () => {
    const result = parseDiaryText('9:00-18:00 #予定 仕事 会議多め');
    expect(result.schedule).toEqual([
      { time: '9:00', endTime: '18:00', content: '仕事 会議多め' },
    ]);
  });

  it('handles multiple tags across lines and ignores plain text lines', () => {
    const text = [
      '今日はまあまあの一日だった',
      '7:00 起床',
      '7:30 #食事 朝食 パンとコーヒー',
      '12:30 #支出 800円 ランチ',
      '19:00 #運動 ランニング 30分',
      '21:00 #スマホ YouTube 45分',
    ].join('\n');
    const result = parseDiaryText(text);
    expect(result.schedule).toHaveLength(1);
    expect(result.meals).toHaveLength(1);
    expect(result.spending).toHaveLength(1);
    expect(result.exercises).toHaveLength(1);
    expect(result.phoneUsage).toHaveLength(1);
  });
});
