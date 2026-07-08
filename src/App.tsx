import { useState } from 'react';
import { useDiaryEntries } from './hooks/useDiaryEntries';
import { RecordView } from './components/RecordView';
import { HistoryView } from './components/HistoryView';
import { StatsView } from './components/StatsView';

type Tab = 'record' | 'history' | 'stats';

const TABS: { key: Tab; label: string }[] = [
  { key: 'record', label: '記録' },
  { key: 'history', label: '履歴' },
  { key: 'stats', label: '集計' },
];

function App() {
  const [tab, setTab] = useState<Tab>('record');
  const { entries, save, remove } = useDiaryEntries();

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>私生活ログ</h1>
      </header>

      <main className="app-main">
        {tab === 'record' && <RecordView entries={entries} onSave={save} />}
        {tab === 'history' && <HistoryView entries={entries} onDelete={remove} />}
        {tab === 'stats' && <StatsView entries={entries} />}
      </main>

      <nav className="app-tabbar">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={t.key === tab ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
