import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { downloadExportZip } from './api/export';
import { uploadImage } from './api/upload';
import './App.css';

type UploadToastStatus = 'uploading' | 'success' | 'error';

type UploadToast = {
  id: string;
  status: UploadToastStatus;
  title: string;
  message?: string;
  progress?: number;
};

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const DEFAULT_SIDEBAR_WIDTH = 260;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 420;
const TOAST_DISMISS_DELAY = 2000;

function App() {
  const [exporting, setExporting] = useState(false);
  const [toasts, setToasts] = useState<UploadToast[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toastTimersRef = useRef<Map<string, number>>(new Map());
  const uploadControllersRef = useRef<Map<string, AbortController>>(
    new Map(),
  );
  const resizeStateRef = useRef<{ startX: number; startWidth: number } | null>(
    null,
  );

  const isFileDrag = (event: React.DragEvent<HTMLElement>) => {
    const { dataTransfer } = event;
    if (!dataTransfer) {
      return false;
    }

    if (dataTransfer.items && dataTransfer.items.length > 0) {
      return Array.from(dataTransfer.items).some((item) => {
        if (item.kind !== 'file') {
          return false;
        }
        if (!item.type) {
          return true;
        }
        return item.type.startsWith('image/');
      });
    }

    return Array.from(dataTransfer.types).includes('Files');
  };

  const createToastId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const addToast = (toast: UploadToast) => {
    setToasts((prev) => [toast, ...prev]);
  };

  const updateToast = (id: string, patch: Partial<UploadToast>) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, ...patch } : toast,
      ),
    );
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = toastTimersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      toastTimersRef.current.delete(id);
    }
  };

  const scheduleToastDismiss = (id: string) => {
    const timer = window.setTimeout(() => {
      removeToast(id);
    }, TOAST_DISMISS_DELAY);
    toastTimersRef.current.set(id, timer);
  };

  const clampSidebarWidth = (value: number) =>
    Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, value));

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

  const handleFile = async (file: File | undefined) => {
    setDragActive(false);
    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      const toastId = createToastId();
      addToast({
        id: toastId,
        status: 'error',
        title: '上传失败',
        message: '仅支持 png / jpg / webp 图片格式',
      });
      scheduleToastDismiss(toastId);
      return;
    }

    const toastId = createToastId();
    addToast({
      id: toastId,
      status: 'uploading',
      title: '上传中',
      progress: 0,
    });

    const controller = new AbortController();
    uploadControllersRef.current.set(toastId, controller);

    try {
      await uploadImage(file, {
        signal: controller.signal,
        onProgress: (percent) => {
          updateToast(toastId, { progress: Math.round(percent) });
        },
      });
      updateToast(toastId, {
        status: 'success',
        title: '上传成功',
        progress: 100,
      });
      scheduleToastDismiss(toastId);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        removeToast(toastId);
        return;
      }
      const message =
        err instanceof Error ? err.message : '上传失败，请重试';
      updateToast(toastId, {
        status: 'error',
        title: '上传失败',
        message,
      });
      scheduleToastDismiss(toastId);
    } finally {
      uploadControllersRef.current.delete(toastId);
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

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isFileDrag(event)) {
      return;
    }
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isFileDrag(event)) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
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

  const handleResizeMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    resizeStateRef.current = {
      startX: event.clientX,
      startWidth: sidebarWidth,
    };
    setIsResizing(true);
  };

  useEffect(() => {
    return () => {
      uploadControllersRef.current.forEach((controller) => {
        controller.abort();
      });
      uploadControllersRef.current.clear();
      toastTimersRef.current.forEach((timer) => {
        window.clearTimeout(timer);
      });
      toastTimersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const state = resizeStateRef.current;
      if (!state) {
        return;
      }
      const delta = event.clientX - state.startX;
      setSidebarWidth(clampSidebarWidth(state.startWidth + delta));
    };

    const handleMouseUp = () => {
      resizeStateRef.current = null;
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      document.body.classList.add('is-resizing');
      return () => document.body.classList.remove('is-resizing');
    }

    document.body.classList.remove('is-resizing');
    return undefined;
  }, [isResizing]);

  const pageStyle = {
    '--sidebar-width': `${sidebarWidth}px`,
  } as CSSProperties;

  return (
    <div className="page" style={pageStyle}>
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
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast is-${toast.status}`}
            role="status"
          >
            <div className="toast-row">
              <span className="toast-title">{toast.title}</span>
              {toast.status === 'uploading' && (
                <span className="toast-percent">
                  {toast.progress ?? 0}%
                </span>
              )}
            </div>
            {toast.status === 'uploading' && (
              <div
                className="toast-progress"
                role="progressbar"
                aria-valuenow={toast.progress ?? 0}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="toast-progress-bar"
                  style={{ width: `${toast.progress ?? 0}%` }}
                />
              </div>
            )}
            {toast.status === 'error' && toast.message && (
              <div className="toast-message">{toast.message}</div>
            )}
          </div>
        ))}
      </div>
      <div className="layout">
        <aside
          className={`sidebar${isResizing ? ' is-resizing' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className={`sidebar-overlay${dragActive ? ' is-active' : ''}`}
            aria-hidden="true"
          />
          <section className="upload-zone">
            <div className="upload-zone-inner" />
          </section>
          <div className="sidebar-footer">
            <input
              ref={fileInputRef}
              className="upload-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="sidebar-add"
              title="添加图片"
              aria-label="添加图片"
              onClick={handleSelectClick}
            >
              <span aria-hidden>+</span>
            </button>
          </div>
        </aside>
        <div
          className={`sidebar-resizer${isResizing ? ' is-resizing' : ''}`}
          role="separator"
          aria-orientation="vertical"
          aria-label="调整侧边栏宽度"
          onMouseDown={handleResizeMouseDown}
        />
        <main className="content" />
      </div>
    </div>
  );
}

export default App;
