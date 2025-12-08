import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  onTextExtracted: (text: string) => void;
  onError: (error: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onTextExtracted, onError }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError('Please select an image file (PNG, JPG, JPEG, etc.)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError('Image file is too large. Please select an image under 10MB.');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleExtractText = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      // Dynamic import to avoid bundling issues
      const { extractTextFromImage } = await import('../services/ocrService');
      const extractedText = await extractTextFromImage(selectedImage);
      onTextExtracted(extractedText);
      handleClear();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract text from image';
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!imagePreview && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-3">
            {/* Upload Icon */}
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            
            <div className="font-hand">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                <span className="text-blue-600 dark:text-blue-400 font-bold">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, JPEG (max 10MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src={imagePreview}
                alt="Uploaded preview"
                className="max-w-full md:max-w-xs max-h-64 object-contain rounded shadow-sm border border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Controls */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-marker text-lg text-gray-800 dark:text-gray-200 mb-2">
                  Image Ready for Processing
                </h4>
                <p className="font-hand text-sm text-gray-600 dark:text-gray-400 mb-1">
                  File: {selectedImage?.name}
                </p>
                <p className="font-hand text-sm text-gray-600 dark:text-gray-400">
                  Size: {((selectedImage?.size || 0) / 1024).toFixed(2)} KB
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleExtractText}
                  disabled={isProcessing}
                  className={`
                    flex-1 px-4 py-2 rounded-sm shadow-md font-marker transform transition-all border-b-2
                    ${isProcessing
                      ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'bg-green-400 hover:bg-green-500 text-green-900 border-green-600 hover:-translate-y-1'
                    }
                  `}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Extracting Text...
                    </span>
                  ) : (
                    'Extract Text from Image'
                  )}
                </button>

                <button
                  onClick={handleClear}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-sm shadow-sm font-marker transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-3" />
                <p className="font-hand text-lg text-gray-700 dark:text-gray-300">
                  Reading your handwriting...
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
