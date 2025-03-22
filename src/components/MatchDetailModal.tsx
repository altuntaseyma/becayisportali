import React from 'react';
import { MatchPair } from '../types/matching';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface MatchDetailModalProps {
  match: MatchPair;
  onClose: () => void;
  isOpen: boolean;
  onAccept?: (matchId: string) => void;
  onReject?: (matchId: string) => void;
}

const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ 
  match, 
  onClose, 
  isOpen,
  onAccept,
  onReject 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Kapat</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Eşleşme Detayları
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Eşleşme Skorları</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Toplam Skor:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(match.score.totalScore * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Konum Uyumu:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(match.score.locationScore * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Kurum Uyumu:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(match.score.institutionScore * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pozisyon Uyumu:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(match.score.positionScore * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Durum</h4>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      match.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {match.status === 'pending' ? 'Beklemede' :
                     match.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Oluşturulma Tarihi</h4>
                  <p className="text-sm text-gray-900">
                    {match.createdAt.toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {match.status === 'pending' && onAccept && onReject && (
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => onAccept(match.id)}
                  >
                    Kabul Et
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => onReject(match.id)}
                  >
                    Reddet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailModal; 