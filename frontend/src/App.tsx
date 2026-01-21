import { useEffect, useState } from 'react';
import { fetchUsers } from './api/users';
import type { User } from './api/users';
import { downloadExportZip } from './api/export';
import './App.css';

type LoadState = 'loading' | 'ready' | 'error';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [error, setError] = useState('');
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

  useEffect(() => {
    let active = true;

    fetchUsers()
      .then((data) => {
        if (!active) {
          return;
        }
        setUsers(data);
        setState('ready');
      })
      .catch((err: Error) => {
        if (!active) {
          return;
        }
        setError(err.message);
        setState('error');
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app">
      <div className="toolbar">
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

      <section className="panel">
        <div className="panel-header">
          <h2>Users API</h2>
          <p>GET /users</p>
        </div>

        {state === 'loading' && <p className="muted">Loading users...</p>}
        {state === 'error' && (
          <p className="error">Failed to load users: {error}</p>
        )}
        {state === 'ready' && (
          <ul className="user-list">
            {users.map((user) => (
              <li key={user.id}>
                <span className="user-id">#{user.id}</span>
                <span className="user-name">{user.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
