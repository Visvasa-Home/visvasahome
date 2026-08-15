import { supabase } from '@core/db/supabaseClient';

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

// Upload file to Supabase Storage
export const uploadFile = async (
  file: File,
  bucket: 'profiles' | 'reviews' | 'documents',
  folder?: string
): Promise<UploadResult> => {
  try {
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 10MB'
      };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only images (JPEG, PNG, WebP) and PDFs are allowed.'
      };
    }

    // Generate unique file name
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${extension}`;

    // Construct file path
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while uploading'
    };
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (
  files: File[],
  bucket: 'profiles' | 'reviews' | 'documents',
  folder?: string
): Promise<UploadResult[]> => {
  const uploadPromises = files.map(file => uploadFile(file, bucket, folder));
  return Promise.all(uploadPromises);
};

// Delete file from Supabase Storage
export const deleteFile = async (
  filePath: string,
  bucket: 'profiles' | 'reviews' | 'documents'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while deleting'
    };
  }
};

// Delete multiple files
export const deleteMultipleFiles = async (
  filePaths: string[],
  bucket: 'profiles' | 'reviews' | 'documents'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove(filePaths);

    if (error) {
      console.error('Error deleting files:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting files:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while deleting'
    };
  }
};

// Get public URL for a file
export const getFileUrl = (
  filePath: string,
  bucket: 'profiles' | 'reviews' | 'documents'
): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// Upload profile image
export const uploadProfileImage = async (file: File, userId: string): Promise<UploadResult> => {
  return uploadFile(file, 'profiles', userId);
};

// Upload review images
export const uploadReviewImages = async (
  files: File[],
  reviewId: string
): Promise<UploadResult[]> => {
  return uploadMultipleFiles(files, 'reviews', reviewId);
};

// Upload professional documents
export const uploadProfessionalDocuments = async (
  files: File[],
  professionalId: string
): Promise<UploadResult[]> => {
  return uploadMultipleFiles(files, 'documents', professionalId);
};

// Resize image before upload (for profile images)
export const resizeImage = (
  file: File,
  maxWidth: number = 400,
  maxHeight: number = 400
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }

          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });

          resolve(resizedFile);
        }, file.type);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Compress and upload image
export const compressAndUploadImage = async (
  file: File,
  bucket: 'profiles' | 'reviews' | 'documents',
  folder?: string,
  maxWidth: number = 1200,
  maxHeight: number = 1200
): Promise<UploadResult> => {
  try {
    // Resize image if it's too large
    const resizedFile = await resizeImage(file, maxWidth, maxHeight);

    // Upload resized image
    return uploadFile(resizedFile, bucket, folder);
  } catch (error) {
    console.error('Error compressing and uploading image:', error);
    return {
      success: false,
      error: 'Failed to compress and upload image'
    };
  }
};

// Validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, or WebP)'
    };
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image file size must be less than 10MB'
    };
  }

  return { valid: true };
};

// Validate PDF file
export const validatePDFFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (file.type !== 'application/pdf') {
    return {
      valid: false,
      error: 'Please upload a valid PDF file'
    };
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'PDF file size must be less than 10MB'
    };
  }

  return { valid: true };
};

// Get file size in human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Create thumbnail from image file
export const createThumbnail = (
  file: File,
  width: number = 200,
  height: number = 200
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate scaling and positioning for cover effect
        const scale = Math.max(width / img.width, height / img.height);
        const x = (width / 2) - (img.width / 2) * scale;
        const y = (height / 2) - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        resolve(canvas.toDataURL(file.type));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
