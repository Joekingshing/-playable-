import { useEffect, useState } from 'react';
import { fetchUsers } from './api/users';
import type { User } from './api/users';
import './App.css';

type LoadState = 'loading' | 'ready' | 'error';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [error, setError] = useState('');

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
