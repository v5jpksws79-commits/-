import { useMemo, useState } from 'react';
import { formatDateJa } from '../lib/date';
import { parseDiaryText } from '../lib/parseDiary';
import type { DiaryEntry } from '../lib/types';
import { ParsedPreview } from './ParsedPreview';

interface Props {
  entries: Record<string, DiaryEntry>;
  onDelete: (date: string) => void;
}

export function HistoryView({ entries, onDelete }: Props) {
  const sortedDates = useMemo(
    () => Object.keys(entries).sort((a, b) => b.localeCompare(a)),
    [entries],
  );
  const [expanded, setExpanded] = useState<string | null>(sortedDates[0] ?? null);

  if (sortedDates.length === 0) {
    return <p className="empty-state">まだ記録がありません。「記録」タブから今日の日記を書いてみましょう。</p>;
  }

  return (
    <div className="history-view">
      {sortedDates.map((date) => {
        const entry = entries[date];
        const isOpen = expanded === date;
        const parsed = parseDiaryText(entry.text);
        return (
          <div className="history-item" key={date}>
            <button
              className="history-item-header"
              onClick={() => setExpanded(isOpen ? null : date)}
            >
              <span className="history-date">{formatDateJa(date)}</span>
              <span className="history-toggle">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div className="history-item-body">
                <pre className="history-raw-text">{entry.text}</pre>
                <ParsedPreview data={parsed} />
                <button
                  className="delete-btn"
                  onClick={() => {
                    if (confirm(`${formatDateJa(date)}の記録を削除しますか?`)) {
                      onDelete(date);
                    }
                  }}
                >
                  この日の記録を削除
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
