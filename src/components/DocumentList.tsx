import React from 'react';
import { ExchangeRequest } from '../types/database';
import { DocumentIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DocumentListProps {
  documents: ExchangeRequest['documents'];
  onDelete?: (document: ExchangeRequest['documents'][0]) => void;
  canDelete?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDelete,
  canDelete = false
}) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-xl">
        <p className="text-gray-500">Henüz belge yüklenmemiş</p>
      </div>
    );
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <PhotoIcon className="h-6 w-6 text-blue-500" />;
      case 'petition':
        return <DocumentIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <DocumentIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getDocumentTypeText = (type: string) => {
    switch (type) {
      case 'photo':
        return 'Fotoğraf';
      case 'petition':
        return 'Dilekçe';
      case 'id':
        return 'Kimlik';
      default:
        return 'Diğer';
    }
  };

  return (
    <div className="space-y-4">
      {documents.map((doc, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            {getDocumentIcon(doc.type)}
            <div>
              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
              <p className="text-xs text-gray-500">
                {getDocumentTypeText(doc.type)} •{' '}
                {new Date(doc.uploadedAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
            >
              Görüntüle
            </a>
            {canDelete && onDelete && (
              <button
                onClick={() => onDelete(doc)}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList; 