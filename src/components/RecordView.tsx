import { useEffect, useMemo, useRef, useState } from 'react';
import { addDays, formatDateJa, todayKey } from '../lib/date';
import { parseDiaryText } from '../lib/parseDiary';
import type { DiaryEntry } from '../lib/types';
import { TagCheatSheet } from './TagCheatSheet';
import { ParsedPreview } from './ParsedPreview';

interface Props {
  entries: Record<string, DiaryEntry>;
  onSave: (date: string, text: string) => void;
}

export function RecordView({ entries, onSave }: Props) {
  const [date, setDate] = useState(todayKey());
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'saved'>('idle');
  const saveTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setText(entries[date]?.text ?? '');
    setStatus('idle');
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  const parsed = useMemo(() => parseDiaryText(text), [text]);

  function handleChange(value: string) {
    setText(value);
    setStatus('idle');
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      onSave(date, value);
      setStatus('saved');
    }, 800);
  }

  function handleSaveNow() {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    onSave(date, text);
    setStatus('saved');
  }

  return (
    <div className="record-view">
      <div className="date-nav">
        <button onClick={() => setDate((d) => addDays(d, -1))} aria-label="前の日">←</button>
        <div className="date-nav-current">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <span>{formatDateJa(date)}</span>
        </div>
        <button onClick={() => setDate((d) => addDays(d, 1))} aria-label="次の日">→</button>
        {date !== todayKey() && (
          <button className="today-btn" onClick={() => setDate(todayKey())}>今日</button>
        )}
      </div>

      <TagCheatSheet />

      <textarea
        className="diary-textarea"
        placeholder={'今日の出来事を自由に書いてください。\n例:\n7:00 起床\n7:00 #睡眠 7時間30分\n7:30 #食事 朝食 パンとコーヒー\n12:30 #支出 800円 ランチ\n19:00 #運動 ランニング 30分'}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        rows={14}
      />

      <div className="save-row">
        <button className="save-btn" onClick={handleSaveNow}>保存</button>
        <span className="save-status">{status === 'saved' ? '保存済み' : ''}</span>
      </div>

      <div className="preview-panel">
        <h3>抽出結果プレビュー</h3>
        <ParsedPreview data={parsed} />
      </div>
    </div>
  );
}
