import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage, db } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { UserCircleIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { iller, ilceler } from '../data/turkiyeData';
import { userService } from '../services/userService';
import { verificationService } from '../services/verificationService';
import { User } from '../types/database';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface EditableUser extends Partial<User> {
  location?: {
    il: string;
    ilce: string;
  };
}

const positions = [
  'Öğretmen',
  'Akademisyen',
  'Doktor',
  'Hemşire',
  'Memur',
  'Teknisyen',
  'Mühendis',
  'Tekniker',
  'İdari Personel',
  'Sağlık Personeli',
  'Büro Personeli',
  'Diğer'
];

const kurumTurleri = [
  'Adalet Bakanlığı',
  'Aile ve Sosyal Hizmetler Bakanlığı',
  'Çalışma ve Sosyal Güvenlik Bakanlığı',
  'Çevre, Şehircilik ve İklim Değişikliği Bakanlığı',
  'Dışişleri Bakanlığı',
  'Enerji ve Tabii Kaynaklar Bakanlığı',
  'Gençlik ve Spor Bakanlığı',
  'Hazine ve Maliye Bakanlığı',
  'İçişleri Bakanlığı',
  'Kültür ve Turizm Bakanlığı',
  'Milli Eğitim Bakanlığı',
  'Milli Savunma Bakanlığı',
  'Sağlık Bakanlığı',
  'Sanayi ve Teknoloji Bakanlığı',
  'Tarım ve Orman Bakanlığı',
  'Ticaret Bakanlığı',
  'Ulaştırma ve Altyapı Bakanlığı',
  'Diğer Kamu Kurumları'
];

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | React.ReactNode | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<EditableUser>({
    location: { il: '', ilce: '' }
  });
  const [verificationStatus, setVerificationStatus] = useState<{
    isVerified: boolean;
    status: 'pending' | 'verified' | 'rejected' | 'not_submitted';
    frontImageUrl?: string;
    backImageUrl?: string;
    errors?: string[];
  }>({
    isVerified: false,
    status: 'not_submitted'
  });
  const [selectedFiles, setSelectedFiles] = useState<{
    front?: File;
    back?: File;
  }>({});

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      if (currentUser) {
        const user = await userService.getUser(currentUser.uid);
        if (user) {
          setUserData(user);
          setEditedData({
            fullName: user.fullName || '',
            email: user.email || '',
            institution: user.institution || '',
            department: user.department || '',
            title: user.title || '',
            location: {
              il: user.location?.il || '',
              ilce: user.location?.ilce || ''
            }
          });
        }
        
        const status = await verificationService.getVerificationStatus(currentUser.uid);
        setVerificationStatus(status);
      }
    } catch (err) {
      console.error('Kullanıcı bilgileri yüklenirken hata:', err);
      setError('Kullanıcı bilgileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      location: {
        ...prev.location!,
        [name]: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFiles(prev => ({
        ...prev,
        [side]: file
      }));
    }
  };

  const handleVerification = async () => {
    if (!selectedFiles.front || !selectedFiles.back || !currentUser) {
      setError('Lütfen kimlik kartınızın her iki yüzünü de yükleyin.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await verificationService.verifyUser(
        currentUser.uid,
        selectedFiles.front,
        selectedFiles.back
      );

      if (result.success) {
        setSuccess('Kimlik doğrulama başarılı!');
        loadUserData();
      } else {
        if (result.errors && result.errors.length > 0) {
          setError(
            <div>
              <p>Kimlik doğrulama başarısız:</p>
              <ul className="list-disc list-inside mt-2">
                {result.errors.map((err, index) => (
                  <li key={index} className="text-sm">{err}</li>
                ))}
              </ul>
            </div>
          );
        } else {
          setError(result.message);
        }
      }
    } catch (err: any) {
      console.error('Doğrulama sırasında hata:', err);
      if (err.code === 'storage/unauthorized') {
        setError(
          <div>
            <p>Dosya yükleme hatası:</p>
            <p className="text-sm mt-2">
              Sistem şu anda dosya yüklemeye hazır değil. Lütfen daha sonra tekrar deneyin veya sistem yöneticisiyle iletişime geçin.
            </p>
          </div>
        );
      } else {
        setError(err.message || 'Doğrulama işlemi sırasında bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      await userService.updateUser(currentUser.uid, editedData);
      setSuccess('Profil bilgileri başarıyla güncellendi.');
      setIsEditing(false);
      loadUserData();
    } catch (err) {
      console.error('Profil güncellenirken hata:', err);
      setError('Profil güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Profil Bilgileri</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <PencilIcon className="h-5 w-5 mr-1" />
                  Düzenle
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <input
                    type="text"
                    name="fullName"
                    value={editedData.fullName || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">E-posta</label>
                  <input
                    type="email"
                    value={userData?.email || ''}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Kurum</label>
                  <input
                    type="text"
                    name="institution"
                    value={editedData.institution || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Departman</label>
                  <input
                    type="text"
                    name="department"
                    value={editedData.department || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Unvan</label>
                  <input
                    type="text"
                    name="title"
                    value={editedData.title || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">İl</label>
                  <input
                    type="text"
                    name="il"
                    value={editedData.location?.il || ''}
                    onChange={handleLocationChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">İlçe</label>
                  <input
                    type="text"
                    name="ilce"
                    value={editedData.location?.ilce || ''}
                    onChange={handleLocationChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedData(userData || {});
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              )}
            </form>

            {/* Kimlik Doğrulama Bölümü */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Kimlik Doğrulama</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center">
                  {verificationStatus.status === 'verified' ? (
                    <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                  ) : verificationStatus.status === 'rejected' ? (
                    <XCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                  ) : null}
                  <div>
                    <p className="font-medium">
                      {verificationStatus.status === 'verified' && 'Kimliğiniz doğrulandı'}
                      {verificationStatus.status === 'pending' && 'Doğrulama bekliyor'}
                      {verificationStatus.status === 'rejected' && 'Doğrulama reddedildi'}
                      {verificationStatus.status === 'not_submitted' && 'Kimlik doğrulaması gerekiyor'}
                    </p>
                    {verificationStatus.errors && verificationStatus.errors.length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-sm text-red-600">
                        {verificationStatus.errors.map((err, index) => (
                          <li key={index}>{err}</li>
                        ))}
                      </ul>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {verificationStatus.status === 'not_submitted' && 
                        'Lütfen kurum kimlik kartınızın ön ve arka yüzünü yükleyin'}
                      {verificationStatus.status === 'rejected' && 
                        'Lütfen bilgilerinizi kontrol edip tekrar deneyin'}
                    </p>
                  </div>
                </div>
              </div>

              {verificationStatus.status !== 'verified' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kimlik Kartı (Ön Yüz)
                    </label>
                    <p className="text-xs text-gray-500 mb-1">
                      Desteklenen formatlar: JPG, JPEG, PNG (Maks. 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={(e) => handleFileChange(e, 'front')}
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kimlik Kartı (Arka Yüz)
                    </label>
                    <p className="text-xs text-gray-500 mb-1">
                      Desteklenen formatlar: JPG, JPEG, PNG (Maks. 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={(e) => handleFileChange(e, 'back')}
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleVerification}
                    disabled={loading || !selectedFiles.front || !selectedFiles.back}
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Doğrulanıyor...
                      </span>
                    ) : 'Kimliği Doğrula'}
                  </button>
                </div>
              )}

              {(verificationStatus.frontImageUrl || verificationStatus.backImageUrl) && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {verificationStatus.frontImageUrl && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Yüklenen Ön Yüz</p>
                      <img
                        src={verificationStatus.frontImageUrl}
                        alt="Kimlik ön yüz"
                        className="w-full h-auto rounded-lg object-contain max-h-64"
                      />
                    </div>
                  )}
                  {verificationStatus.backImageUrl && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Yüklenen Arka Yüz</p>
                      <img
                        src={verificationStatus.backImageUrl}
                        alt="Kimlik arka yüz"
                        className="w-full h-auto rounded-lg object-contain max-h-64"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 