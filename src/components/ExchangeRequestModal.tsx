import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { exchangeService } from '../services/exchangeService';
import DocumentUpload from './DocumentUpload';
import { ExchangeRequest } from '../types/database';
import { iller, ilceler } from '../data/turkiyeData';

interface ExchangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<ExchangeRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  request: ExchangeRequest | null;
  canEdit?: boolean;
}

const ExchangeRequestModal: React.FC<ExchangeRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  request,
  canEdit = true
}) => {
  const { currentUser, currentUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ExchangeRequest, 'id' | 'createdAt' | 'updatedAt'>>({
    userId: currentUser?.uid || '',
    currentCity: currentUserData?.currentLocation?.city || '',
    currentDistrict: currentUserData?.currentLocation?.district || '',
    targetCities: [
      { il: '', ilce: '', priority: 1 },
      { il: '', ilce: '', priority: 2 },
      { il: '', ilce: '', priority: 3 }
    ],
    institution: currentUserData?.institution || '',
    department: '',
    position: '',
    notes: '',
    isActive: true,
    matches: [],
    documents: []
  });

  useEffect(() => {
    if (!isOpen) return;
    if (request) {
      setFormData({
        ...request,
        targetCities: [
          ...request.targetCities,
          ...Array(3 - request.targetCities.length).fill({ il: '', ilce: '', priority: 0 })
        ].map((city, index) => ({
          ...city,
          priority: index + 1
        }))
      });
    } else {
      setFormData({
        userId: currentUser?.uid || '',
        currentCity: currentUserData?.currentLocation?.city || '',
        currentDistrict: currentUserData?.currentLocation?.district || '',
        targetCities: [
          { il: '', ilce: '', priority: 1 },
          { il: '', ilce: '', priority: 2 },
          { il: '', ilce: '', priority: 3 }
        ],
        institution: currentUserData?.institution || '',
        department: '',
        position: '',
        notes: '',
        isActive: true,
        matches: [],
        documents: []
      });
    }
  }, [request, currentUser, currentUserData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTargetCityChange = (index: number, field: 'il' | 'ilce', value: string) => {
    setFormData(prev => ({
      ...prev,
      targetCities: prev.targetCities.map((city, i) => 
        i === index ? { ...city, [field]: value } : city
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validasyonu
    if (!formData.currentCity || !formData.currentDistrict) {
      setError('Mevcut şehir ve ilçe bilgileri gereklidir.');
      return;
    }

    // En az bir hedef şehir kontrolü
    const validTargetCities = formData.targetCities.filter(city => city.il && city.ilce);
    if (validTargetCities.length === 0) {
      setError('En az bir hedef şehir seçmelisiniz.');
      return;
    }

    // Aynı şehir kontrolü
    if (validTargetCities.some(city => city.il === formData.currentCity)) {
      setError('Hedef şehir mevcut şehrinizle aynı olamaz.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Geçerli hedef şehirleri filtrele
      const cleanedFormData = {
        ...formData,
        targetCities: validTargetCities
      };

      await onSubmit(cleanedFormData);
      onClose();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Becayiş talebi kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {canEdit
              ? (request ? 'Becayiş Talebini Düzenle' : 'Yeni Becayiş Talebi')
              : 'Becayiş Talebi Detayı'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {canEdit ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mevcut Şehir
                  </label>
                  <select
                    name="currentCity"
                    value={formData.currentCity}
                    onChange={e => {
                      const selectedCity = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        currentCity: selectedCity,
                        currentDistrict: '', // şehir değişince ilçe sıfırlanır
                      }));
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Şehir Seçin</option>
                    {iller.map(il => (
                      <option key={il} value={il}>{il}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mevcut İlçe
                  </label>
                  <select
                    name="currentDistrict"
                    value={formData.currentDistrict}
                    onChange={e => setFormData(prev => ({ ...prev, currentDistrict: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={!formData.currentCity}
                  >
                    <option value="">İlçe Seçin</option>
                    {formData.currentCity && ilceler[formData.currentCity]?.map(ilce => (
                      <option key={ilce} value={ilce}>{ilce}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hedef Şehirler
                  </label>
                  {formData.targetCities.map((city, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <select
                        value={city.il}
                        onChange={(e) => handleTargetCityChange(index, 'il', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Şehir Seçin</option>
                        {Object.keys(ilceler).map((il) => (
                          <option key={il} value={il}>
                            {il}
                          </option>
                        ))}
                      </select>

                      <select
                        value={city.ilce}
                        onChange={(e) => handleTargetCityChange(index, 'ilce', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        disabled={!city.il}
                      >
                        <option value="">İlçe Seçin</option>
                        {city.il && ilceler[city.il].map((ilce) => (
                          <option key={ilce} value={ilce}>
                            {ilce}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            targetCities: prev.targetCities.filter((_, i) => i !== index)
                          }));
                        }}
                        className="px-3 py-2 text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </div>
                  ))}

                  {formData.targetCities.length < 3 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          targetCities: [
                            ...prev.targetCities,
                            { il: '', ilce: '', priority: prev.targetCities.length + 1 }
                          ]
                        }));
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-900"
                    >
                      + Hedef Şehir Ekle
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notlar
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Talebi Aktif Tut
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : request ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mevcut Şehir</label>
                  <div className="mt-1">{formData.currentCity}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mevcut İlçe</label>
                  <div className="mt-1">{formData.currentDistrict}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hedef Şehirler</label>
                  <div className="mt-1">{formData.targetCities.map(tc => tc.il).filter(Boolean).join(', ') || '-'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kurum</label>
                  <div className="mt-1">{formData.institution || '-'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Departman</label>
                  <div className="mt-1">{formData.department || '-'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pozisyon</label>
                  <div className="mt-1">{formData.position || '-'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notlar</label>
                  <div className="mt-1">{formData.notes || '-'}</div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Kapat
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeRequestModal; 