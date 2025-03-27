import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { exchangeService } from '../services/exchangeService';
import { ExchangeRequest } from '../types/database';
import { iller } from '../data/turkiyeData';

const ExchangeRequests = () => {
  const { currentUser, currentUserData } = useAuth();
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    sourceCity: '',
    targetCity: '',
    department: '',
    institution: '',
    onlyActive: true
  });

  useEffect(() => {
    loadRequests();
  }, [filters]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const allRequests = await exchangeService.getAllExchangeRequests(filters);
      setRequests(allRequests);
    } catch (error) {
      console.error('İstekler yüklenirken hata:', error);
      setError('İstekler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const isMatchPotential = (request: ExchangeRequest) => {
    if (!currentUserData) return false;
    return (
      request.userId !== currentUser?.uid &&
      request.currentCity === currentUserData.location.il &&
      request.targetCity === request.currentCity &&
      request.department === currentUserData.department
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tüm Becayiş İstekleri</h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filtreler */}
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filtreler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="sourceCity" className="block text-sm font-medium text-gray-700">
                Mevcut İl
              </label>
              <select
                id="sourceCity"
                name="sourceCity"
                value={filters.sourceCity}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tüm İller</option>
                {iller.map(il => (
                  <option key={il} value={il}>{il}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="targetCity" className="block text-sm font-medium text-gray-700">
                Hedef İl
              </label>
              <select
                id="targetCity"
                name="targetCity"
                value={filters.targetCity}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tüm İller</option>
                {iller.map(il => (
                  <option key={il} value={il}>{il}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Kurum Kategorisi
              </label>
              <select
                id="department"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tümü</option>
                <option value="Sağlık">Sağlık</option>
                <option value="Eğitim">Eğitim</option>
                <option value="Emniyet">Emniyet</option>
                <option value="Adalet">Adalet</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                Kurum Türü
              </label>
              <select
                id="institution"
                name="institution"
                value={filters.institution}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tümü</option>
                <option value="Hastane">Hastane</option>
                <option value="Okul">Okul</option>
                <option value="Üniversite">Üniversite</option>
                <option value="Polis Merkezi">Polis Merkezi</option>
                <option value="Adliye">Adliye</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex items-center">
              <input
                id="onlyActive"
                name="onlyActive"
                type="checkbox"
                checked={filters.onlyActive}
                onChange={handleFilterChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="onlyActive" className="ml-2 block text-sm text-gray-900">
                Sadece Aktif İstekler
              </label>
            </div>
          </div>
        </div>

        {/* İstekler Tablosu */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Yükleniyor...</div>
          ) : requests.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Bu kriterlere uygun becayiş isteği bulunamadı.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mevcut Konum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hedef Konum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kurum Bilgileri
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map(request => (
                  <tr 
                    key={request.id}
                    className={isMatchPotential(request) ? 'bg-blue-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.currentCity}</div>
                      <div className="text-sm text-gray-500">{request.currentDistrict}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.targetCity}</div>
                      <div className="text-sm text-gray-500">{request.targetDistrict}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.department}</div>
                      <div className="text-sm text-gray-500">{request.institution}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {request.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isMatchPotential(request) ? (
                        <button
                          onClick={() => {/* İletişim bilgilerini göster */}}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          İletişime Geç
                        </button>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeRequests; 