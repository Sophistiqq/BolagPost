import { put } from '@vercel/blob';

export function generateUniqueFilename(originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${random}.${ext}`;
}

export function isValidImageType(mimeType: string): boolean {
  return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mimeType);
}

export function getMaxFileSize(): number {
  return 5 * 1024 * 1024; // 5MB
}

export async function uploadToBlob(file: File): Promise<string> {
  const filename = generateUniqueFilename(file.name);
  const { url } = await put(filename, file, {
    access: 'public',
  });
  return url;
}
