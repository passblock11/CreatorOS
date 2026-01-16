import { uploadAPI } from './api';
import axios from 'axios';

const VERCEL_SAFE_SIZE = 4 * 1024 * 1024; // 4MB - safe limit for Vercel Hobby plan
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB - maximum allowed

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  type: string;
  resourceType?: string;
  createdAt?: string;
}

/**
 * Upload file - automatically chooses best method based on file size
 * - Small files (< 4MB): Upload through backend
 * - Large files (> 4MB): Direct upload to Cloudinary
 */
export const uploadMedia = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/x-msvideo',
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, MOV, AVI) are allowed.');
    }

    console.log(`📤 Uploading file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    // Choose upload method based on file size
    if (file.size <= VERCEL_SAFE_SIZE) {
      console.log('📤 Using backend upload (file < 4MB)');
      return await uploadViaBackend(file, onProgress);
    } else {
      console.log('📤 Using direct Cloudinary upload (file > 4MB)');
      return await uploadDirectToCloudinary(file, onProgress);
    }
  } catch (error: any) {
    console.error('❌ Upload error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Upload failed');
  }
};

/**
 * Upload via backend (for smaller files)
 */
const uploadViaBackend = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await uploadAPI.uploadMedia(file);
  
  if (onProgress) {
    onProgress(100);
  }

  return response.data.data;
};

/**
 * Upload directly to Cloudinary (for larger files)
 */
const uploadDirectToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  // Step 1: Get signed upload parameters from backend
  console.log('🔐 Getting upload signature...');
  const token = localStorage.getItem('token');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4004/api';
  
  const signatureResponse = await axios.get(`${API_URL}/upload/signature`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { signature, timestamp, cloudName, apiKey, folder } = signatureResponse.data.data;

  console.log('✅ Signature received, uploading to Cloudinary...');

  // Step 2: Upload directly to Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', apiKey);
  formData.append('folder', folder);

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const uploadResponse = await axios.post(cloudinaryUrl, formData, {
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  console.log('✅ Uploaded to Cloudinary:', uploadResponse.data);

  // Step 3: Verify upload with backend
  const verifyResponse = await axios.post(
    `${API_URL}/upload/verify`,
    {
      publicId: uploadResponse.data.public_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('✅ Upload verified');

  return verifyResponse.data.data;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Check if file size is safe for backend upload
 */
export const isSafeForBackendUpload = (fileSize: number): boolean => {
  return fileSize <= VERCEL_SAFE_SIZE;
};

/**
 * Get upload method description
 */
export const getUploadMethodDescription = (fileSize: number): string => {
  if (fileSize <= VERCEL_SAFE_SIZE) {
    return 'Standard upload (via backend)';
  } else if (fileSize <= MAX_FILE_SIZE) {
    return 'Direct upload (to Cloudinary)';
  } else {
    return 'File too large';
  }
};
