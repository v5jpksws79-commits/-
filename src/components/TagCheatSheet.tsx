const RULES: { tag: string; example: string; desc: string }[] = [
  { tag: '(時刻のみ)', example: '7:00 起床 / 9:00-18:00 仕事', desc: 'タグなしで時刻から始まる行は自動でスケジュールとして記録' },
  { tag: '#支出', example: '#支出 食費: 800円 定食', desc: '「カテゴリ: 金額円 メモ」。カテゴリは省略可' },
  { tag: '#食事', example: '#食事 朝食 パンとコーヒー (約350kcal)', desc: '朝食/昼食/夕食/間食/夜食 + 内容。「◯◯kcal」と書くとカロリーを自動集計' },
  { tag: '#運動', example: '#運動 ランニング 30分', desc: '種目 + 時間(分)' },
  { tag: '#スマホ', example: '#スマホ YouTube 45分', desc: 'アプリ・目的 + 時間(分)' },
  { tag: '#予定', example: '#予定 病院で健康診断', desc: '時刻の後ろに書くと時間帯付きの予定として記録' },
];

export function TagCheatSheet() {
  return (
    <details className="cheat-sheet">
      <summary>記法ヘルプを見る</summary>
      <ul>
        {RULES.map((r) => (
          <li key={r.tag}>
            <code>{r.tag}</code>
            <span className="cheat-example">{r.example}</span>
            <span className="cheat-desc">{r.desc}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
