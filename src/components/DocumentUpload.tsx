import React, { useState } from 'react';
import { documentService } from '../services/documentService';
import { ExchangeRequest } from '../types/database';

interface DocumentUploadProps {
  userId: string;
  exchangeRequestId: string;
  onUploadComplete: (document: ExchangeRequest['documents'][0]) => void;
  onUploadError: (error: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  userId,
  exchangeRequestId,
  onUploadComplete,
  onUploadError
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dosya validasyonu
    const validation = documentService.validateFile(file);
    if (!validation.isValid) {
      onUploadError(validation.error || 'Geçersiz dosya.');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      // Dosya tipini belirle
      let type: 'petition' | 'id' | 'photo' | 'other';
      if (file.type === 'application/pdf') {
        type = 'petition';
      } else if (file.type.startsWith('image/')) {
        type = 'photo';
      } else {
        type = 'other';
      }

      // Dosyayı yükle
      const result = await documentService.uploadDocument(
        file,
        userId,
        exchangeRequestId,
        type
      );

      // Başarılı yükleme
      onUploadComplete({
        type,
        url: result.url,
        name: result.name,
        uploadedAt: new Date()
      });
    } catch (error) {
      console.error('Belge yükleme hatası:', error);
      onUploadError('Belge yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="document-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-2 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-1 text-sm text-gray-500">
              <span className="font-semibold">Belge yüklemek için tıklayın</span> veya sürükleyip bırakın
            </p>
            <p className="text-xs text-gray-500">
              PDF veya resim dosyası (max. 5MB)
            </p>
          </div>
          <input
            id="document-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </label>
      </div>

      {uploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Yükleniyor...</p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload; 