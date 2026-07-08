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
    data.phoneUsage.length === 0;

  if (isEmpty) {
    return <p className="parsed-empty">まだ抽出されたデータはありません。タグを使って書いてみましょう。</p>;
  }

  const totalSpending = data.spending.reduce((sum, s) => sum + s.amount, 0);
  const totalExercise = data.exercises.reduce((sum, e) => sum + (e.durationMin ?? 0), 0);
  const totalPhone = data.phoneUsage.reduce((sum, p) => sum + (p.durationMin ?? 0), 0);
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
      {data.phoneUsage.length > 0 && (
        <section>
          <h4>スマホ利用 <span className="tag-total">計 {totalPhone}分</span></h4>
          <ul>
            {data.phoneUsage.map((p, i) => (
              <li key={i}>
                {p.time && <span className="tag-time">{p.time}</span>} {p.app}
                {p.durationMin != null && <span className="tag-badge">{p.durationMin}分</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
