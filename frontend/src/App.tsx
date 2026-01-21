import { useState } from 'react';
import { downloadExportZip } from './api/export';
import './App.css';

function App() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (exporting) {
      return;
    }

    setExporting(true);
    try {
      await downloadExportZip();
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="page">
      <div className="toolbar">
        <div className="toolbar-inner">
          <div className="toolbar-title">项目名</div>
          <div className="toolbar-actions">
            <button type="button" className="toolbar-button">
              保存
            </button>
            <button
              type="button"
              className="toolbar-button primary"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? '导出中...' : '导出'}
            </button>
          </div>
        </div>
      </div>
      <main className="app">
        <header className="hero">
          <div>
            <p className="eyebrow">Playable Studio</p>
            <h1>Fullstack Monorepo Template</h1>
            <p className="subtitle">
              React + Vite frontend paired with a multi-app NestJS backend.
            </p>
          </div>
          <div className="status-card">
            <span className="status-label">Backend status</span>
            <span className="status-value">/health</span>
          </div>
        </header>
      </main>
    </div>
  );
}

export default App;
