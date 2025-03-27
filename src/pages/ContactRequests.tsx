import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { contactService } from '../services/contactService';
import { ContactRequest } from '../types/database';

const ContactRequests = () => {
  const { currentUser, currentUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [receivedRequests, setReceivedRequests] = useState<ContactRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ContactRequest[]>([]);

  useEffect(() => {
    if (currentUser) {
      loadRequests();
    }
  }, [currentUser]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const [received, sent] = await Promise.all([
        contactService.getReceivedRequests(currentUser!.uid),
        contactService.getSentRequests(currentUser!.uid)
      ]);
      setReceivedRequests(received);
      setSentRequests(sent);
    } catch (error) {
      console.error('İletişim talepleri yüklenirken hata:', error);
      setError('İletişim talepleri yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await contactService.updateContactRequestStatus(requestId, status);
      await loadRequests();

      setSuccess(
        status === 'accepted'
          ? 'İletişim talebi kabul edildi.'
          : 'İletişim talebi reddedildi.'
      );
    } catch (error) {
      console.error('İletişim talebi güncellenirken hata:', error);
      setError('İletişim talebi güncellenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || !currentUserData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">İletişim Talepleri</h1>
            <p className="mt-2 text-sm text-gray-600">
              Gelen ve gönderilen iletişim taleplerini buradan yönetebilirsiniz.
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {loading && receivedRequests.length === 0 && sentRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Yükleniyor...</div>
          ) : receivedRequests.length === 0 && sentRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Henüz bir iletişim talebi bulunmuyor.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Gelen Talepler */}
              {receivedRequests.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Gelen Talepler</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gönderen
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tarih
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {receivedRequests.map((request) => (
                          <tr key={request.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {request.senderName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                request.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : request.status === 'accepted'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {request.status === 'pending'
                                  ? 'Bekliyor'
                                  : request.status === 'accepted'
                                  ? 'Onaylandı'
                                  : 'Reddedildi'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {request.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(request.id, 'accepted')}
                                    disabled={loading}
                                    className="text-green-600 hover:text-green-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Onayla
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(request.id, 'rejected')}
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Reddet
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Gönderilen Talepler */}
              {sentRequests.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Gönderilen Talepler</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Alıcı
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tarih
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sentRequests.map((request) => (
                          <tr key={request.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {request.receiverName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                request.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : request.status === 'accepted'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {request.status === 'pending'
                                  ? 'Bekliyor'
                                  : request.status === 'accepted'
                                  ? 'Onaylandı'
                                  : 'Reddedildi'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactRequests; 