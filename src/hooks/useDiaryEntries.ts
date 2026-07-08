import { useCallback, useState } from 'react';
import { deleteEntry, loadEntries, saveEntry } from '../lib/storage';
import type { DiaryEntry } from '../lib/types';

export function useDiaryEntries() {
  const [entries, setEntries] = useState<Record<string, DiaryEntry>>(() => loadEntries());

  const save = useCallback((date: string, text: string) => {
    const entry = saveEntry(date, text);
    setEntries((prev) => ({ ...prev, [date]: entry }));
    return entry;
  }, []);

  const remove = useCallback((date: string) => {
    deleteEntry(date);
    setEntries((prev) => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
  }, []);

  return { entries, save, remove };
}
