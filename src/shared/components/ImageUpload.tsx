import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { validateImageFile, uploadFile, formatFileSize } from '@utils/storage';

interface ImageUploadProps {
  bucket: 'profiles' | 'reviews' | 'documents';
  folder?: string;
  maxFiles?: number;
  onUploadSuccess?: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
  existingImages?: string[];
}

interface UploadedImage {
  file: File;
  preview: string;
  url?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function ImageUpload({
  bucket,
  folder,
  maxFiles = 5,
  onUploadSuccess,
  onUploadError,
  existingImages = []
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    const remainingSlots = maxFiles - (images.length + existingImages.length);
    if (remainingSlots <= 0) {
      onUploadError?.(`You can only upload up to ${maxFiles} images`);
      return;
    }

    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    // Validate and prepare images
    const newImages: UploadedImage[] = [];

    filesToAdd.forEach((file) => {
      const validation = validateImageFile(file);

      if (!validation.valid) {
        onUploadError?.(validation.error || 'Invalid file');
        return;
      }

      const preview = URL.createObjectURL(file);

      newImages.push({
        file,
        preview,
        status: 'pending'
      });
    });

    setImages([...images, ...newImages]);

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const updatedImages = [...images];
    const removedImage = updatedImages[index];

    // Revoke object URL to free memory
    URL.revokeObjectURL(removedImage.preview);

    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleUploadAll = async () => {
    const pendingImages = images.filter(img => img.status === 'pending' || img.status === 'error');

    if (pendingImages.length === 0) {
      return;
    }

    // Upload each pending image
    const uploadPromises = pendingImages.map(async (img, idx) => {
      const imageIndex = images.indexOf(img);

      // Update status to uploading
      setImages(prev => {
        const updated = [...prev];
        updated[imageIndex] = { ...updated[imageIndex], status: 'uploading' };
        return updated;
      });

      try {
        const result = await uploadFile(img.file, bucket, folder);

        if (result.success && result.url) {
          // Update status to success
          setImages(prev => {
            const updated = [...prev];
            updated[imageIndex] = {
              ...updated[imageIndex],
              status: 'success',
              url: result.url
            };
            return updated;
          });

          return result.url;
        } else {
          // Update status to error
          setImages(prev => {
            const updated = [...prev];
            updated[imageIndex] = {
              ...updated[imageIndex],
              status: 'error',
              error: result.error || 'Upload failed'
            };
            return updated;
          });

          return null;
        }
      } catch (error) {
        // Update status to error
        setImages(prev => {
          const updated = [...prev];
          updated[imageIndex] = {
            ...updated[imageIndex],
            status: 'error',
            error: 'An unexpected error occurred'
          };
          return updated;
        });

        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUrls = results.filter((url): url is string => url !== null);

    if (successfulUrls.length > 0) {
      onUploadSuccess?.(successfulUrls);
    }

    if (results.some(url => url === null)) {
      onUploadError?.('Some images failed to upload');
    }
  };

  const getStatusIcon = (status: UploadedImage['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader className="w-5 h-5 text-[#2563EB] animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const canAddMore = (images.length + existingImages.length) < maxFiles;
  const hasImages = images.length > 0 || existingImages.length > 0;
  const hasPendingUploads = images.some(img => img.status === 'pending' || img.status === 'error');

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {existingImages.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-1">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={img.preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status Overlay */}
              {img.status !== 'pending' && (
                <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${
                  img.status === 'uploading' ? 'bg-black/50' :
                  img.status === 'success' ? 'bg-green-600/20' :
                  'bg-red-600/20'
                }`}>
                  {getStatusIcon(img.status)}
                </div>
              )}

              {/* Remove Button */}
              {(img.status === 'pending' || img.status === 'error') && (
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* File Info */}
              <div className="mt-2">
                <p className="text-xs text-gray-600 truncate">{img.file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(img.file.size)}</p>
                {img.error && (
                  <p className="text-xs text-red-600 mt-1">{img.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#2563EB] hover:bg-blue-50 transition-colors"
          >
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Click to upload images
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP up to 10MB • {maxFiles - (images.length + existingImages.length)} remaining
            </p>
          </button>
        </div>
      )}

      {/* Upload Button */}
      {hasPendingUploads && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Ready to upload</p>
            <p className="text-sm text-gray-600">
              {images.filter(img => img.status === 'pending' || img.status === 'error').length} image(s) pending
            </p>
          </div>
          <Button
            onClick={handleUploadAll}
            className="bg-[#2563EB] hover:bg-[#2563EB]"
            disabled={images.some(img => img.status === 'uploading')}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload All
          </Button>
        </div>
      )}

      {/* Success Message */}
      {images.length > 0 && images.every(img => img.status === 'success') && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm font-medium text-green-900">
            All images uploaded successfully!
          </p>
        </div>
      )}
    </div>
  );
}
