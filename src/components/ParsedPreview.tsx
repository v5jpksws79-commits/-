import type { ParsedDay } from '../lib/types';

function fmtTime(item: { time?: string; endTime?: string }): string {
  if (!item.time) return '';
  return item.endTime ? `${item.time}〜${item.endTime}` : item.time;
}

export function ParsedPreview({ data }: { data: ParsedDay }) {
  const isEmpty =
    data.schedule.length === 0 &&
    data.meals.length === 0 &&
    data.exercises.length === 0 &&
    data.spending.length === 0 &&
    data.sleep.length === 0;

  if (isEmpty) {
    return <p className="parsed-empty">まだ抽出されたデータはありません。タグを使って書いてみましょう。</p>;
  }

  const totalSpending = data.spending.reduce((sum, s) => sum + s.amount, 0);
  const totalExercise = data.exercises.reduce((sum, e) => sum + (e.durationMin ?? 0), 0);
  const totalSleep = data.sleep.reduce((sum, s) => sum + (s.hours ?? 0), 0);
  const totalKcal = data.meals.reduce((sum, m) => sum + (m.kcal ?? 0), 0);

  return (
    <div className="parsed-preview">
      {data.schedule.length > 0 && (
        <section>
          <h4>スケジュール</h4>
          <ul>
            {data.schedule.map((s, i) => (
              <li key={i}>
                <span className="tag-time">{fmtTime(s)}</span> {s.content}
              </li>
            ))}
          </ul>
        </section>
      )}
      {data.sleep.length > 0 && (
        <section>
          <h4>睡眠 <span className="tag-total">計 {totalSleep}時間</span></h4>
          <ul>
            {data.sleep.map((s, i) => (
              <li key={i}>
                {s.time && <span className="tag-time">{s.time}</span>}
                {s.hours != null && <span className="tag-badge">{s.hours}時間</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
      {data.meals.length > 0 && (
        <section>
          <h4>食事{totalKcal > 0 && <span className="tag-total">計 約{totalKcal.toLocaleString()}kcal</span>}</h4>
          <ul>
            {data.meals.map((m, i) => (
              <li key={i}>
                {m.time && <span className="tag-time">{m.time}</span>}
                {m.mealType && <span className="tag-badge">{m.mealType}</span>} {m.content}
              </li>
            ))}
          </ul>
        </section>
      )}
      {data.exercises.length > 0 && (
        <section>
          <h4>運動 <span className="tag-total">計 {totalExercise}分</span></h4>
          <ul>
            {data.exercises.map((e, i) => (
              <li key={i}>
                {e.time && <span className="tag-time">{e.time}</span>} {e.type}
                {e.durationMin != null && <span className="tag-badge">{e.durationMin}分</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
      {data.spending.length > 0 && (
        <section>
          <h4>支出 <span className="tag-total">計 {totalSpending.toLocaleString()}円</span></h4>
          <ul>
            {data.spending.map((s, i) => (
              <li key={i}>
                {s.time && <span className="tag-time">{s.time}</span>}
                {s.category && <span className="tag-badge">{s.category}</span>}
                {' '}{s.amount.toLocaleString()}円 {s.memo}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
