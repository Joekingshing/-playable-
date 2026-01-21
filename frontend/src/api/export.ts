import { apiDownload } from './client';

function getFilenameFromDisposition(disposition: string | null) {
  if (!disposition) {
    return null;
  }

  const match = /filename\*?=(?:UTF-8''|"?)([^";]+)"?/i.exec(disposition);
  if (!match) {
    return null;
  }

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export async function downloadExportZip() {
  const response = await apiDownload('/export');
  const blob = await response.blob();
  const filename =
    getFilenameFromDisposition(response.headers.get('content-disposition')) ??
    `${Date.now()}.zip`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
