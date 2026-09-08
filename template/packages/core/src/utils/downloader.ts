import { Platform, Share } from 'react-native';
import RNBlobUtil from 'react-native-blob-util';

export type DownloadDestination = 'documents' | 'cache';

export interface DownloadConfig {
  url: string;
  filename: string;
  destination?: DownloadDestination;
  headers?: Record<string, string>;
  onProgress?: (receivedBytes: number, totalBytes: number) => void;
}

export interface DownloadResult {
  filePath: string;
}

export interface ActiveDownload {
  promise: Promise<DownloadResult>;
  cancel: () => void;
}

const MIME_MAP: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  zip: 'application/zip',
  txt: 'text/plain',
  csv: 'text/csv',
  json: 'application/json',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export const getMimeType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return MIME_MAP[ext] ?? 'application/octet-stream';
};

export const getDestinationPath = (
  filename: string,
  destination: DownloadDestination,
): string => {
  const { dirs } = RNBlobUtil.fs;
  const dir = destination === 'cache' ? dirs.CacheDir : dirs.DocumentDir;
  return `${dir}/${filename}`;
};

/**
 * Starts a file download and returns a task with a cancel handle and a promise.
 *
 * Usage:
 *   const task = startDownload({ url, filename, onProgress: (rx, total) => ... });
 *   const { filePath } = await task.promise;
 *   // or task.cancel() to abort
 */
export const startDownload = ({
  url,
  filename,
  destination = 'documents',
  headers = {},
  onProgress,
}: DownloadConfig): ActiveDownload => {
  const destPath = getDestinationPath(filename, destination);

  const task = RNBlobUtil.config({
    path: destPath,
    overwrite: true,
  }).fetch('GET', url, headers);

  // interval: ms between progress events to avoid flooding the bridge
  task.progress({ interval: 200 }, (received, total) => {
    onProgress?.(received, total);
  });

  const promise: Promise<DownloadResult> = task.then(response => ({
    filePath: response.path(),
  }));

  return {
    promise,
    cancel: () => task.cancel(),
  };
};

/**
 * Opens a downloaded file using the OS viewer.
 * Android: ACTION_VIEW intent. iOS: Share sheet (allows Open In…).
 */
export const openFile = async (
  filePath: string,
  filename: string,
): Promise<void> => {
  if (Platform.OS === 'android') {
    await RNBlobUtil.android.actionViewIntent(filePath, getMimeType(filename));
  } else {
    await Share.share({ url: `file://${filePath}`, title: filename });
  }
};
