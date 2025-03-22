import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { UserCircleIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { iller, ilceler } from '../data/turkiyeData';

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser?.uid) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
          setEditedProfile(docSnap.data() as UserProfile);
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Lütfen geçerli bir resim dosyası seçin');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleProfileUpdate = async () => {
    if (!currentUser?.uid || !editedProfile) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Zorunlu alanları kontrol et
      const requiredFields = ['kurumTuru', 'kurum', 'il', 'ilce', 'pozisyon'];
      const missingFields = requiredFields.filter(field => !editedProfile[field as keyof UserProfile]);

      if (missingFields.length > 0) {
        throw new Error(`Lütfen tüm zorunlu alanları doldurunuz: ${missingFields.map(field => {
          switch(field) {
            case 'kurumTuru': return 'Bakanlık/Kurum';
            case 'kurum': return 'Çalıştığınız Birim';
            case 'il': return 'İl';
            case 'ilce': return 'İlçe';
            case 'pozisyon': return 'Pozisyon';
            default: return field;
          }
        }).join(', ')}`);
      }

      let photoURL = profile?.photoURL;

      if (selectedFile) {
        try {
          const storageRef = ref(storage, `profile-photos/${currentUser.uid}`);
          await uploadBytes(storageRef, selectedFile);
          photoURL = await getDownloadURL(storageRef);
        } catch (uploadError) {
          console.error('Profil fotoğrafı yüklenirken hata:', uploadError);
          throw new Error('Profil fotoğrafı yüklenirken bir hata oluştu');
        }
      }

      const updateData = {
        ...editedProfile,
        photoURL: photoURL || '',
        updatedAt: new Date()
      };

      // Boş değerleri temizle
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === '') {
          delete updateData[key as keyof typeof updateData];
        }
      });

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, updateData);

      setProfile({ ...editedProfile, photoURL: photoURL || '' });
      setIsEditing(false);
      setSuccess('Profil başarıyla güncellendi');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      setError(error instanceof Error ? error.message : 'Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profil Başlığı */}
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                {profile.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt="Profil fotoğrafı"
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                    <UserCircleIcon className="w-20 h-20 text-gray-400" />
                  </div>
                )}
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                        <PencilIcon className="w-4 h-4" />
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 pb-6 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
                <p className="text-gray-600">{profile.email}</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Düzenle
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedProfile(profile);
                      setError('');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <XMarkIcon className="w-4 h-4 mr-2" />
                    İptal
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4 mr-2" />
                        Kaydet
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
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
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Çalıştığınız Bakanlık/Kurum</label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.kurumTuru || ''}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({ ...prev!, kurumTuru: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Bakanlık/Kurum Seçin</option>
                      {kurumTurleri.map((kurumTuru) => (
                        <option key={kurumTuru} value={kurumTuru}>
                          {kurumTuru}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                      {profile.kurumTuru}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Çalıştığınız Birim</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.kurum || ''}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({ ...prev!, kurum: e.target.value }))
                      }
                      placeholder="Örn: Ankara Adliyesi, Çankaya İlçe Milli Eğitim Müdürlüğü"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                      {profile.kurum}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Pozisyon</label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.pozisyon || ''}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({ ...prev!, pozisyon: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Pozisyon Seçin</option>
                      {positions.map((position) => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                      {profile.pozisyon}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">İl</label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.il || ''}
                      onChange={(e) => {
                        setEditedProfile((prev) => ({
                          ...prev!,
                          il: e.target.value,
                          ilce: '' // İl değiştiğinde ilçeyi sıfırla
                        }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">İl Seçin</option>
                      {iller.map((il) => (
                        <option key={il} value={il}>
                          {il}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                      {profile.il}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">İlçe</label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.ilce || ''}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({ ...prev!, ilce: e.target.value }))
                      }
                      disabled={!editedProfile?.il}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">İlçe Seçin</option>
                      {editedProfile?.il &&
                        ilceler[editedProfile.il]?.map((ilce) => (
                          <option key={ilce} value={ilce}>
                            {ilce}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                      {profile.ilce}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 