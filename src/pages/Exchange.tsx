import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, collection, addDoc, getDocs, query, where, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { iller, ilceler } from '../data/turkiyeData';
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface UserProfile {
  fullName: string;
  email: string;
  kurumTuru: string;
  kurum: string;
  il: string;
  ilce: string;
  pozisyon: string;
  photoURL: string;
}

interface ExchangeRequest {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  kurumTuru: string;
  kurum: string;
  mevcutIl: string;
  mevcutIlce: string;
  pozisyon: string;
  hedefIl: string;
  hedefIlce: string;
  aciklama: string;
  createdAt: Timestamp;
  status: 'Beklemede' | 'Onaylandı' | 'Reddedildi';
}

const Exchange = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);

  const [formData, setFormData] = useState({
    hedefIl: '',
    hedefIlce: '',
    aciklama: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser?.uid) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      }
    };

    const fetchRequests = async () => {
      if (currentUser?.uid) {
        const q = query(
          collection(db, 'exchangeRequests'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const requestsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as ExchangeRequest[];
        setRequests(requestsData);
      }
    };

    fetchUserProfile();
    fetchRequests();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userProfile) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Form validasyonları
      if (!formData.hedefIl || !formData.hedefIlce) {
        throw new Error('Lütfen hedef il ve ilçe seçiniz');
      }

      if (!userProfile.kurumTuru || !userProfile.kurum || !userProfile.pozisyon) {
        throw new Error('Lütfen önce profil bilgilerinizi tamamlayınız');
      }

      // Yeni istek oluşturma
      const newRequest: Omit<ExchangeRequest, 'id'> = {
        userId: currentUser.uid,
        userName: userProfile.fullName || '',
        userEmail: userProfile.email || '',
        kurumTuru: userProfile.kurumTuru || '',
        kurum: userProfile.kurum || '',
        mevcutIl: userProfile.il || '',
        mevcutIlce: userProfile.ilce || '',
        pozisyon: userProfile.pozisyon || '',
        hedefIl: formData.hedefIl,
        hedefIlce: formData.hedefIlce,
        aciklama: formData.aciklama || '',
        createdAt: Timestamp.now(),
        status: 'Beklemede'
      };

      // Tüm zorunlu alanların dolu olduğunu kontrol et
      const requiredFields = ['userName', 'kurumTuru', 'kurum', 'mevcutIl', 'mevcutIlce', 'pozisyon', 'hedefIl', 'hedefIlce'];
      const missingFields = requiredFields.filter(field => !newRequest[field as keyof typeof newRequest]);

      if (missingFields.length > 0) {
        throw new Error(`Lütfen tüm zorunlu alanları doldurunuz: ${missingFields.join(', ')}`);
      }

      // Firestore'a kaydet
      await addDoc(collection(db, 'exchangeRequests'), newRequest);
      
      setSuccess('Becayiş isteğiniz başarıyla oluşturuldu');
      setFormData({ hedefIl: '', hedefIlce: '', aciklama: '' });
      
      // Yeni isteği listeye ekle
      const q = query(
        collection(db, 'exchangeRequests'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const requestsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as ExchangeRequest[];
      setRequests(requestsData);
    } catch (error) {
      console.error('Becayiş isteği oluşturma hatası:', error);
      setError(error instanceof Error ? error.message : 'Becayiş isteği oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!window.confirm('Bu becayiş isteğini silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'exchangeRequests', requestId));
      setRequests(requests.filter(request => request.id !== requestId));
      setSuccess('Becayiş isteği başarıyla silindi');
    } catch (error) {
      setError('Becayiş isteği silinirken bir hata oluştu');
    }
  };

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mevcut Bilgiler */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mevcut Bilgileriniz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                    {userProfile.fullName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bakanlık/Kurum</label>
                  <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                    {userProfile.kurumTuru}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Çalıştığınız Birim</label>
                  <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                    {userProfile.kurum}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pozisyon</label>
                  <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                    {userProfile.pozisyon}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">İl</label>
                  <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                    {userProfile.il}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">İlçe</label>
                  <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                    {userProfile.ilce}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Becayiş İsteği Formu */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hedef Konum Bilgileri</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hedef İl</label>
                  <select
                    value={formData.hedefIl}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        hedefIl: e.target.value,
                        hedefIlce: ''
                      }));
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">İl Seçin</option>
                    {iller.map((il) => (
                      <option key={il} value={il}>
                        {il}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hedef İlçe</label>
                  <select
                    value={formData.hedefIlce}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        hedefIlce: e.target.value
                      }));
                    }}
                    disabled={!formData.hedefIl}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">İlçe Seçin</option>
                    {formData.hedefIl &&
                      ilceler[formData.hedefIl]?.map((ilce) => (
                        <option key={ilce} value={ilce}>
                          {ilce}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                  value={formData.aciklama}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      aciklama: e.target.value
                    }));
                  }}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Becayiş isteğinizle ilgili ek bilgiler..."
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XMarkIcon className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gönderiliyor...
                    </>
                  ) : (
                    'Becayiş İsteği Oluştur'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Becayiş İstekleri Listesi */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Becayiş İsteklerim</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                        <div className="text-sm text-gray-900">{request.mevcutIl}/{request.mevcutIlce}</div>
                        <div className="text-sm text-gray-500">{request.kurum}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.hedefIl}/{request.hedefIlce}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'Beklemede'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'Onaylandı'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => request.id && handleDelete(request.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Henüz becayiş isteği oluşturmadınız
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exchange; 