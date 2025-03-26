import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { exchangeService } from '../services/exchangeService';
import { ExchangeRequest, User } from '../types/database';
import { iller, ilceler } from '../data/turkiyeData';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Exchange = () => {
  const { currentUser, currentUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ExchangeRequest | null>(null);
  const [formData, setFormData] = useState({
    targetCity: '',
    targetDistrict: '',
    notes: '',
    isActive: true
  });
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    city: '',
    onlyActive: true
  });

  useEffect(() => {
    loadRequests();
  }, [currentUser, filters]);

  useEffect(() => {
    if (formData.targetCity) {
      const selectedCityDistricts = ilceler[formData.targetCity] || [];
      setAvailableDistricts(selectedCityDistricts);
      if (!selectedCityDistricts.includes(formData.targetDistrict)) {
        setFormData(prev => ({ ...prev, targetDistrict: '' }));
      }
    } else {
      setAvailableDistricts([]);
    }
  }, [formData.targetCity]);

  const loadRequests = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const fetchedRequests = await exchangeService.getExchangeRequests(filters);
      setRequests(fetchedRequests);
    } catch (error) {
      console.error('Becayiş istekleri yüklenirken hata:', error);
      setError('Becayiş istekleri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUserData) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const requestData = {
        ...formData,
        userId: currentUser.uid,
        userName: currentUserData.name,
        userEmail: currentUser.email!,
        currentCity: currentUserData.location.il,
        currentDistrict: currentUserData.location.ilce,
        institution: currentUserData.institution,
        department: currentUserData.department,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (selectedRequest) {
        await exchangeService.updateExchangeRequest(selectedRequest.id, requestData);
        setSuccess('Becayiş isteği başarıyla güncellendi.');
      } else {
        await exchangeService.createExchangeRequest(requestData);
        setSuccess('Becayiş isteği başarıyla oluşturuldu.');
      }

      setShowForm(false);
      setSelectedRequest(null);
      setFormData({
        targetCity: '',
        targetDistrict: '',
        notes: '',
        isActive: true
      });
      loadRequests();
    } catch (error) {
      console.error('Becayiş isteği kaydedilirken hata:', error);
      setError('Becayiş isteği kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (request: ExchangeRequest) => {
    setSelectedRequest(request);
    setFormData({
      targetCity: request.targetCity,
      targetDistrict: request.targetDistrict,
      notes: request.notes,
      isActive: request.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (requestId: string) => {
    if (!window.confirm('Bu becayiş isteğini silmek istediğinizden emin misiniz?')) return;

    try {
      setLoading(true);
      await exchangeService.deleteExchangeRequest(requestId);
      setSuccess('Becayiş isteği başarıyla silindi.');
      loadRequests();
    } catch (error) {
      console.error('Becayiş isteği silinirken hata:', error);
      setError('Becayiş isteği silinemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Becayiş İstekleri</h1>
          <button
            onClick={() => {
              setSelectedRequest(null);
              setFormData({
                targetCity: '',
                targetDistrict: '',
                notes: '',
                isActive: true
              });
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Yeni İstek
          </button>
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

        {/* Filtreler */}
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filtreler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Hedef İl
              </label>
              <select
                id="city"
                name="city"
                value={filters.city}
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
              <label htmlFor="onlyActive" className="block text-sm font-medium text-gray-700">
                Sadece Aktif İstekler
              </label>
              <div className="mt-2">
                <input
                  type="checkbox"
                  id="onlyActive"
                  name="onlyActive"
                  checked={filters.onlyActive}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white shadow rounded-lg mb-6 p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedRequest ? 'Becayiş İsteği Düzenle' : 'Yeni Becayiş İsteği'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="targetCity" className="block text-sm font-medium text-gray-700">
                    Hedef İl
                  </label>
                  <select
                    id="targetCity"
                    name="targetCity"
                    value={formData.targetCity}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">İl Seçin</option>
                    {iller.map(il => (
                      <option key={il} value={il}>{il}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="targetDistrict" className="block text-sm font-medium text-gray-700">
                    Hedef İlçe
                  </label>
                  <select
                    id="targetDistrict"
                    name="targetDistrict"
                    value={formData.targetDistrict}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.targetCity}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">İlçe Seçin</option>
                    {availableDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notlar
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      İstek Aktif
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : (selectedRequest ? 'Güncelle' : 'Oluştur')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste */}
        <div className="bg-white shadow rounded-lg">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Yükleniyor...</div>
          ) : requests.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Henüz becayiş isteği bulunmuyor.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mevcut Konum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hedef Konum
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
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                        <div className="text-sm text-gray-500">{request.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.currentCity}</div>
                        <div className="text-sm text-gray-500">{request.currentDistrict}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.targetCity}</div>
                        <div className="text-sm text-gray-500">{request.targetDistrict}</div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {currentUser?.uid === request.userId && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(request)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(request.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exchange; 