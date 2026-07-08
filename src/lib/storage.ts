import type { DiaryEntry } from './types';

const STORAGE_KEY = 'life-log:entries:v1';

type EntriesMap = Record<string, DiaryEntry>;

function readAll(): EntriesMap {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as EntriesMap;
  } catch {
    return {};
  }
}

function writeAll(entries: EntriesMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function loadEntries(): EntriesMap {
  return readAll();
}

export function saveEntry(date: string, text: string): DiaryEntry {
  const entries = readAll();
  const entry: DiaryEntry = { date, text, updatedAt: new Date().toISOString() };
  entries[date] = entry;
  writeAll(entries);
  return entry;
}

export function deleteEntry(date: string): void {
  const entries = readAll();
  delete entries[date];
  writeAll(entries);
}

export function getEntry(date: string): DiaryEntry | undefined {
  return readAll()[date];
}
