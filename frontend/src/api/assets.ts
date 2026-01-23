import { apiGet, resolveUrl } from './client';

export type AssetItem = {
  filename: string;
  url: string;
  mtime: number;
};

export type AssetListResponse = {
  items: AssetItem[];
};

export async function listAssets(): Promise<AssetListResponse> {
  const response = await apiGet<AssetListResponse>('/assets/list');
  return {
    items: response.items.map((item) => ({
      ...item,
      url: resolveUrl(item.url),
    })),
  };
}
