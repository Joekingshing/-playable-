import { resolveUrl } from './client';

export type UploadResponse = {
  filename: string;
  savedPath: string;
  size: number;
  mimetype: string;
};

export type UploadOptions = {
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
};

export function uploadImage(
  file: File,
  options: UploadOptions = {},
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', resolveUrl('/upload/image'));
    request.responseType = 'json';

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }
      const percent = Math.round((event.loaded / event.total) * 100);
      options.onProgress?.(percent);
    };

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        const response =
          request.response ??
          (request.responseText ? JSON.parse(request.responseText) : null);
        if (!response) {
          reject(new Error('Empty response'));
          return;
        }
        resolve(response as UploadResponse);
        return;
      }

      const message =
        typeof request.response?.message === 'string'
          ? request.response.message
          : request.responseText;
      reject(new Error(message || `Request failed: ${request.status}`));
    };

    request.onerror = () => {
      reject(new Error('Network error'));
    };

    request.onabort = () => {
      reject(new DOMException('Aborted', 'AbortError'));
    };

    if (options.signal) {
      if (options.signal.aborted) {
        request.abort();
        return;
      }

      const handleAbort = () => request.abort();
      options.signal.addEventListener('abort', handleAbort, { once: true });
      request.addEventListener('loadend', () => {
        options.signal?.removeEventListener('abort', handleAbort);
      });
    }

    const formData = new FormData();
    formData.append('file', file);
    request.send(formData);
  });
}
