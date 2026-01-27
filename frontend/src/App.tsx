import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { downloadExportZip } from './api/export';
import { listAssets, type AssetItem } from './api/assets';
import { uploadImage } from './api/upload';
import './App.css';

type UploadToastStatus = 'success' | 'error';

type UploadToast = {
  id: string;
  status: UploadToastStatus;
  title: string;
};

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const DEFAULT_SIDEBAR_WIDTH = 260;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 420;
const TOAST_DISMISS_DELAY = 2000;
const MAX_DRAG_PREVIEW_SIDE = 200;
const FALLBACK_DRAG_PREVIEW_SIZE = 160;
const INTERNAL_ASSET_MIME = 'application/x-asset';
const ACCEPTED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

function App() {
  const [exporting, setExporting] = useState(false);
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
  const [toasts, setToasts] = useState<UploadToast[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const assetListRef = useRef<HTMLDivElement | null>(null);
  const assetItemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const assetSizeCache = useRef(
    new Map<string, { width: number; height: number }>(),
  );
  const toastTimersRef = useRef<Map<string, number>>(new Map());
  const uploadControllersRef = useRef<Map<string, AbortController>>(
    new Map(),
  );
  const hasInitialScrollRef = useRef(false);
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

  const hasDroppedFiles = (event: React.DragEvent<HTMLElement>) =>
    event.dataTransfer?.files && event.dataTransfer.files.length > 0;

  const getInternalDragData = (event: React.DragEvent<HTMLElement>) =>
    event.dataTransfer?.getData(INTERNAL_ASSET_MIME) ?? '';

  const isInternalDrag = (event: React.DragEvent<HTMLElement>) =>
    Boolean(getInternalDragData(event));

  const hasExternalFileCandidate = (event: React.DragEvent<HTMLElement>) => {
    if (isInternalDrag(event)) {
      return false;
    }

    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) {
      return false;
    }

    if (dataTransfer.items && dataTransfer.items.length > 0) {
      return Array.from(dataTransfer.items).some(
        (item) => item.kind === 'file',
      );
    }

    const types = Array.from(dataTransfer.types ?? []);
    return types.includes('Files') || types.includes('public.file-url');
  };

  const isAcceptedImageFile = (file: File) => {
    if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return true;
    }

    const lowerName = file.name.toLowerCase();
    return ACCEPTED_IMAGE_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  };

  const createToastId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const addToast = (toast: UploadToast) => {
    setToasts((prev) => [toast, ...prev]);
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

  const loadAssets = async (options?: { selectFilename?: string }) => {
    try {
      const response = await listAssets();
      const sorted = [...response.items].sort((a, b) => a.mtime - b.mtime);
      setAssets(sorted);
      if (options?.selectFilename) {
        setSelectedFilename(options.selectFilename);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clampSidebarWidth = (value: number) =>
    Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, value));

  const getDragPreviewSize = (width: number, height: number) => {
    if (width <= 0 || height <= 0) {
      return {
        width: FALLBACK_DRAG_PREVIEW_SIZE,
        height: FALLBACK_DRAG_PREVIEW_SIZE,
      };
    }

    if (width <= MAX_DRAG_PREVIEW_SIDE && height <= MAX_DRAG_PREVIEW_SIDE) {
      return { width, height };
    }

    if (width > height) {
      return {
        width: MAX_DRAG_PREVIEW_SIDE,
        height: Math.round(MAX_DRAG_PREVIEW_SIDE * (height / width)),
      };
    }

    return {
      width: Math.round(MAX_DRAG_PREVIEW_SIDE * (width / height)),
      height: MAX_DRAG_PREVIEW_SIDE,
    };
  };

  const handleAssetDragStart =
    (asset: AssetItem) => (event: React.DragEvent<HTMLButtonElement>) => {
      const { dataTransfer } = event;
      if (!dataTransfer) {
        return;
      }

      const imgElement = event.currentTarget.querySelector(
        'img',
      ) as HTMLImageElement | null;
      const cachedSize = assetSizeCache.current.get(asset.filename);
      const naturalWidth =
        imgElement?.naturalWidth ?? cachedSize?.width ?? 0;
      const naturalHeight =
        imgElement?.naturalHeight ?? cachedSize?.height ?? 0;
      const { width, height } = getDragPreviewSize(
        naturalWidth,
        naturalHeight,
      );

      const dragImage = new Image();
      dragImage.src = imgElement?.currentSrc ?? asset.url;
      dragImage.width = width;
      dragImage.height = height;
      dragImage.style.width = `${width}px`;
      dragImage.style.height = `${height}px`;
      dragImage.style.objectFit = 'contain';
      dragImage.style.position = 'fixed';
      dragImage.style.left = '-10000px';
      dragImage.style.top = '-10000px';
      dragImage.style.pointerEvents = 'none';
      dragImage.style.background = 'transparent';

      document.body.appendChild(dragImage);
      dataTransfer.setDragImage(
        dragImage,
        Math.floor(width / 2),
        Math.floor(height / 2),
      );
      dataTransfer.setData(
        INTERNAL_ASSET_MIME,
        JSON.stringify({ filename: asset.filename, url: asset.url }),
      );

      event.currentTarget.addEventListener(
        'dragend',
        () => dragImage.remove(),
        { once: true },
      );
    };

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
      });
      scheduleToastDismiss(toastId);
      return;
    }

    const uploadId = createToastId();
    const controller = new AbortController();
    uploadControllersRef.current.set(uploadId, controller);

    try {
      const result = await uploadImage(file, { signal: controller.signal });
      await loadAssets({ selectFilename: result.filename });
      const toastId = createToastId();
      addToast({
        id: toastId,
        status: 'success',
        title: '上传成功',
      });
      scheduleToastDismiss(toastId);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      const toastId = createToastId();
      addToast({
        id: toastId,
        status: 'error',
        title: '上传失败',
      });
      scheduleToastDismiss(toastId);
    } finally {
      uploadControllersRef.current.delete(uploadId);
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
    if (isInternalDrag(event)) {
      setDragActive(false);
      return;
    }
    if (!hasExternalFileCandidate(event) || !isFileDrag(event)) {
      return;
    }
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (isInternalDrag(event)) {
      setDragActive(false);
      return;
    }
    if (!hasExternalFileCandidate(event) || !isFileDrag(event)) {
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
    if (isInternalDrag(event)) {
      event.preventDefault();
      setDragActive(false);
      return;
    }
    if (hasExternalFileCandidate(event)) {
      event.preventDefault();
    }
    if (!hasDroppedFiles(event)) {
      return;
    }
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }
    if (!isAcceptedImageFile(file)) {
      return;
    }
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
    void loadAssets();
  }, []);

  useEffect(() => {
    assets.forEach((asset) => {
      if (assetSizeCache.current.has(asset.filename)) {
        return;
      }
      const preload = new Image();
      preload.src = asset.url;
      preload.onload = () => {
        assetSizeCache.current.set(asset.filename, {
          width: preload.naturalWidth,
          height: preload.naturalHeight,
        });
      };
    });
  }, [assets]);

  useEffect(() => {
    const list = assetListRef.current;
    if (!list) {
      return;
    }
    if (selectedFilename) {
      const item = assetItemRefs.current.get(selectedFilename);
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
      return;
    }

    if (!hasInitialScrollRef.current) {
      list.scrollTop = list.scrollHeight;
      hasInitialScrollRef.current = true;
    }
  }, [assets, selectedFilename]);

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

  const handleAssetSelect = (filename: string) => {
    setSelectedFilename(filename);
  };

  const registerAssetRef =
    (filename: string) => (node: HTMLButtonElement | null) => {
      if (node) {
        assetItemRefs.current.set(filename, node);
      } else {
        assetItemRefs.current.delete(filename);
      }
    };

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
            <span className="toast-title">{toast.title}</span>
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
            <div className="asset-list" ref={assetListRef}>
              {assets.map((asset) => (
                <button
                  key={asset.filename}
                  ref={registerAssetRef(asset.filename)}
                  type="button"
                  className={`asset-card${
                    asset.filename === selectedFilename
                      ? ' is-selected'
                      : ''
                  }`}
                  onClick={() => handleAssetSelect(asset.filename)}
                  onDragStart={handleAssetDragStart(asset)}
                >
                  <img
                    className="asset-thumb"
                    src={asset.url}
                    alt={asset.filename}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
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
