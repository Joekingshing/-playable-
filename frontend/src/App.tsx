import { useEffect, useRef, useState } from 'react';
import { fetchUsers } from './api/users';
import type { User } from './api/users';
import { downloadExportZip } from './api/export';
import './App.css';

type LoadState = 'loading' | 'ready' | 'error';
type UploadState = 'idle' | 'uploading' | 'success' | 'error';
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadFilename, setUploadFilename] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const readerRef = useRef<FileReader | null>(null);

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

  const resetUploadState = () => {
    setUploadState('idle');
    setUploadProgress(0);
    setUploadMessage('');
    setUploadFilename('');
  };

  const handleFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUploadState('error');
      setUploadProgress(0);
      setUploadFilename(file.name);
      setUploadMessage('仅支持 png / jpg / webp 图片格式');
      return;
    }

    readerRef.current?.abort();
    setUploadState('uploading');
    setUploadProgress(0);
    setUploadFilename(file.name);
    setUploadMessage('');

    const reader = new FileReader();
    readerRef.current = reader;
    reader.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }
      const nextValue = Math.round((event.loaded / event.total) * 100);
      setUploadProgress(nextValue);
    };
    reader.onload = () => {
      setUploadProgress(100);
      setUploadState('success');
      setUploadMessage('上传成功');
    };
    reader.onerror = () => {
      setUploadState('error');
      setUploadProgress(0);
      setUploadMessage('上传失败，请重试');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file);
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return;
    }
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
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

  useEffect(() => {
    return () => {
      readerRef.current?.abort();
    };
  }, []);

  const showProgress =
    uploadState === 'uploading' || uploadState === 'success';
  const uploadStatusText =
    uploadState === 'uploading'
      ? `上传中 ${uploadProgress}%`
      : uploadState === 'success'
        ? `上传成功：${uploadFilename}`
        : uploadMessage;

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
        <section
          className={`upload-zone${dragActive ? ' is-dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-zone-inner">
            <div>
              <h2 className="upload-zone-title">图片上传</h2>
              <p className="upload-zone-subtitle">
                支持拖拽上传，或点击按钮选择图片
              </p>
            </div>
            <div className="upload-actions">
              <input
                ref={fileInputRef}
                className="upload-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="toolbar-button"
                onClick={handleSelectClick}
              >
                选择图片
              </button>
              <span className="upload-hint">支持 png / jpg / webp</span>
            </div>
            {uploadState !== 'idle' && (
              <div className="upload-feedback" aria-live="polite">
                {showProgress && (
                  <div
                    className="upload-progress"
                    role="progressbar"
                    aria-valuenow={uploadProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="upload-progress-bar"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                <p className={`upload-status ${uploadState}`}>
                  {uploadStatusText}
                </p>
                {uploadState === 'success' && (
                  <button
                    type="button"
                    className="upload-reset"
                    onClick={resetUploadState}
                  >
                    继续上传
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

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
      </main>
    </div>
  );
}

export default App;
