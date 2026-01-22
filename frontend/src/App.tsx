import { useEffect, useRef, useState } from 'react';
import { downloadExportZip } from './api/export';
import { uploadImage } from './api/upload';
import './App.css';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

function App() {
  const [exporting, setExporting] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadFilename, setUploadFilename] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setUploadState('idle');
    setUploadProgress(0);
    setUploadMessage('');
    setUploadFilename('');
  };

  const handleFile = async (file: File | undefined) => {
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

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setUploadState('uploading');
    setUploadProgress(0);
    setUploadFilename(file.name);
    setUploadMessage('');

    try {
      const result = await uploadImage(file, {
        signal: controller.signal,
        onProgress: (percent) => setUploadProgress(percent),
      });
      setUploadProgress(100);
      setUploadState('success');
      setUploadFilename(result.filename);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      const message =
        err instanceof Error ? err.message : '上传失败，请重试';
      setUploadState('error');
      setUploadProgress(0);
      setUploadMessage(message);
    }
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
    return () => {
      abortControllerRef.current?.abort();
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
      <div className="layout">
        <aside className="sidebar">
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
        </aside>
        <main className="content" />
      </div>
    </div>
  );
}

export default App;
