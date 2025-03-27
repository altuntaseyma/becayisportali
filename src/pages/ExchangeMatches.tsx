import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { exchangeService } from '../services/exchangeService';
import { contactService } from '../services/contactService';
import { ExchangeRequest, ContactRequest } from '../types/database';
import { iller } from '../data/turkiyeData';

const ExchangeMatches = () => {
  const { currentUser, currentUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [matches, setMatches] = useState<ExchangeRequest[]>([]);
  const [activeRequests, setActiveRequests] = useState<ExchangeRequest[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);

  useEffect(() => {
    if (currentUser && currentUserData) {
      loadActiveRequests();
      loadContactRequests();
    }
  }, [currentUser, currentUserData]);

  const loadContactRequests = async () => {
    try {
      const sent = await contactService.getSentRequests(currentUser!.uid);
      const received = await contactService.getReceivedRequests(currentUser!.uid);
      setContactRequests([...sent, ...received]);
    } catch (error) {
      console.error('İletişim talepleri yüklenirken hata:', error);
    }
  };

  const loadActiveRequests = async () => {
    try {
      setLoading(true);
      const requests = await exchangeService.getUserExchangeRequests(currentUser!.uid);
      const active = requests.filter(req => req.isActive);
      setActiveRequests(active);
      
      if (active.length > 0) {
        await loadMatches(active);
      }
    } catch (error) {
      console.error('Aktif istekler yüklenirken hata:', error);
      setError('Aktif istekler yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async (requests: ExchangeRequest[]) => {
    try {
      const allMatches: ExchangeRequest[] = [];
      
      for (const request of requests) {
        const potentialMatches = await exchangeService.checkForMatches(request);
        allMatches.push(...potentialMatches);
      }

      // Tekrarlanan eşleşmeleri kaldır
      const uniqueMatches = allMatches.filter((match, index, self) =>
        index === self.findIndex((m) => m.id === match.id)
      );

      setMatches(uniqueMatches);
    } catch (error) {
      console.error('Eşleşmeler yüklenirken hata:', error);
      setError('Eşleşmeler yüklenemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleContactRequest = async (match: ExchangeRequest) => {
    if (!currentUser || !currentUserData) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Mevcut talep kontrolü
      const hasExisting = await contactService.checkExistingRequest(
        currentUser.uid,
        match.userId,
        match.id
      );

      if (hasExisting) {
        setError('Bu kullanıcıya zaten bir iletişim talebi gönderdiniz.');
        return;
      }

      await contactService.createContactRequest({
        senderId: currentUser.uid,
        senderName: currentUserData.name,
        receiverId: match.userId,
        receiverName: match.userName,
        exchangeRequestId: match.id
      });

      setSuccess('İletişim talebi başarıyla gönderildi.');
      await loadContactRequests();
    } catch (error) {
      console.error('İletişim talebi gönderilirken hata:', error);
      setError('İletişim talebi gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const getContactRequestStatus = (match: ExchangeRequest) => {
    const request = contactRequests.find(
      req => 
        (req.senderId === currentUser?.uid && req.receiverId === match.userId) ||
        (req.receiverId === currentUser?.uid && req.senderId === match.userId)
    );

    if (!request) return null;

    return {
      status: request.status,
      isSender: request.senderId === currentUser?.uid
    };
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
            <h1 className="text-2xl font-semibold text-gray-900">Becayiş Eşleşmeleri</h1>
            <p className="mt-2 text-sm text-gray-600">
              Aktif isteklerinizle eşleşen diğer kullanıcıların istekleri burada listelenir.
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

          {loading ? (
            <div className="text-center text-gray-500 py-8">Yükleniyor...</div>
          ) : activeRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aktif becayiş isteğiniz bulunmuyor.
              <br />
              <a href="/exchange" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
                Yeni istek oluşturmak için tıklayın
              </a>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Henüz bir eşleşme bulunamadı.
              <br />
              <p className="text-sm mt-2">
                Eşleşme olduğunda buradan görebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı Bilgileri
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mevcut Konum
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İstediği Konumlar
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kurum Bilgileri
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {matches.map((match) => {
                    const contactStatus = getContactRequestStatus(match);
                    return (
                      <tr key={match.id}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{match.userName}</div>
                          <div className="text-sm text-gray-500">
                            {match.userEmail.replace(/^(.)(.*)(@.*)$/, '$1***$3')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{match.currentCity}</div>
                          <div className="text-sm text-gray-500">{match.currentDistrict}</div>
                          {match.currentRegion && (
                            <div className="text-xs text-gray-500">
                              {match.currentRegion}. Hizmet Bölgesi
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {match.targetCities.map((city, index) => (
                              <div key={index} className="mb-1">
                                {index + 1}. {city.il} {city.ilce ? `- ${city.ilce}` : ''}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{match.institution}</div>
                          <div className="text-sm text-gray-500">{match.position}</div>
                          <div className="text-xs text-gray-500">{match.serviceClass}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {contactStatus ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              contactStatus.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : contactStatus.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {contactStatus.status === 'pending'
                                ? contactStatus.isSender
                                  ? 'Talep Gönderildi'
                                  : 'Talep Alındı'
                                : contactStatus.status === 'accepted'
                                ? 'Onaylandı'
                                : 'Reddedildi'}
                            </span>
                          ) : (
                            <button
                              onClick={() => handleContactRequest(match)}
                              disabled={loading}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              İletişim Talep Et
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeMatches; 