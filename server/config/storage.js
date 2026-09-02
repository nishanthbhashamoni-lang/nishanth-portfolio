import { put, del } from '@vercel/blob';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localUploadsDir = path.join(__dirname, '..', 'data', 'uploads');
const localResumeDir = path.join(localUploadsDir, 'resume');
const localFilesDir = path.join(localUploadsDir, 'files');

[localUploadsDir, localResumeDir, localFilesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export const isVercelBlobActive = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function uploadFileBlob({ folder = 'uploads', filename, buffer, contentType }) {
  const sanitizedName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
  
  if (isVercelBlobActive()) {
    const pathname = `${folder}/${Date.now()}-${sanitizedName}`;
    const blob = await put(pathname, buffer, {
      access: 'public',
      contentType: contentType || 'application/octet-stream'
    });
    return {
      url: blob.url,
      downloadUrl: blob.downloadUrl || blob.url,
      pathname: blob.pathname
    };
  }

  // Local disk fallback for offline development
  const uniqueName = `${Date.now()}-${sanitizedName}`;
  const targetDir = folder === 'resume' ? localResumeDir : (folder === 'files' ? localFilesDir : localUploadsDir);
  const targetPath = path.join(targetDir, uniqueName);
  fs.writeFileSync(targetPath, buffer);

  const relativeUrl = `/uploads/${folder === 'resume' ? 'resume/' : (folder === 'files' ? 'files/' : '')}${uniqueName}`;
  return {
    url: relativeUrl,
    downloadUrl: relativeUrl,
    pathname: targetPath
  };
}

export async function deleteFileBlob(urlOrPath) {
  if (!urlOrPath) return false;
  if (isVercelBlobActive() && urlOrPath.startsWith('http')) {
    try {
      await del(urlOrPath);
      return true;
    } catch (e) {
      console.warn('Vercel Blob deletion notice:', e.message);
      return false;
    }
  }

  // Local fallback deletion
  try {
    const filename = path.basename(urlOrPath);
    for (const d of [localUploadsDir, localResumeDir, localFilesDir]) {
      const p = path.join(d, filename);
      if (fs.existsSync(p)) {
        fs.unlinkSync(p);
        return true;
      }
    }
  } catch (e) {}
  return false;
}