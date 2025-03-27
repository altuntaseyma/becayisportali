import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { exchangeService } from '../services/exchangeService';
import { ExchangeRequest } from '../types/database';
import ExchangeRequestModal from '../components/ExchangeRequestModal';

const Exchange: React.FC = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ExchangeRequest | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadUserRequests();
    } else {
      setLoading(false);
      setRequests([]);
    }
  }, [currentUser]);

  const loadUserRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      if (currentUser) {
        const userRequests = await exchangeService.getUserExchangeRequests(currentUser.uid);
        setRequests(userRequests || []);
      }
    } catch (err) {
      console.error('Error loading requests:', err);
      setError('Becayiş talepleriniz yüklenirken bir hata oluştu.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = () => {
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleEditRequest = (request: ExchangeRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = async (id: string) => {
    if (window.confirm('Bu becayiş talebini silmek istediğinizden emin misiniz?')) {
      try {
        await exchangeService.deleteExchangeRequest(id);
        setSuccess('Becayiş talebi başarıyla silindi.');
        loadUserRequests();
      } catch (err) {
        setError('Becayiş talebi silinirken bir hata oluştu.');
        console.error('Error deleting request:', err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleModalSubmit = async (formData: Omit<ExchangeRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedRequest) {
        await exchangeService.updateExchangeRequest(selectedRequest.id, formData);
        setSuccess('Becayiş talebi başarıyla güncellendi.');
      } else {
        await exchangeService.createExchangeRequest({
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setSuccess('Becayiş talebi başarıyla oluşturuldu.');
      }
      setIsModalOpen(false);
      setSelectedRequest(null);
      loadUserRequests();
    } catch (err) {
      setError('Becayiş talebi kaydedilirken bir hata oluştu.');
      console.error('Error saving request:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Becayiş Taleplerim</h1>
        <button
          onClick={handleCreateRequest}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Yeni Becayiş Talebi
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mevcut Şehir
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hedef Şehirler
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kurum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departman
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests && requests.length > 0 ? (
              requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.currentCity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.targetCities?.map((city: { il: string }) => city.il).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.institution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditRequest(request)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(request.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Henüz becayiş talebiniz bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ExchangeRequestModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          request={selectedRequest}
        />
      )}
    </div>
  );
};

export default Exchange; 