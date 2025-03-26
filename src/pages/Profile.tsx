import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage, db } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { UserCircleIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { iller, ilceler } from '../data/turkiyeData';
import { userService } from '../services/userService';
import { User } from '../types/database';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

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
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    department: '',
    location: {
      il: '',
      ilce: ''
    }
  });
  const [selectedIl, setSelectedIl] = useState('');
  const [availableIlceler, setAvailableIlceler] = useState<string[]>([]);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser?.uid) {
        try {
          const user = await userService.getUser(currentUser.uid);
          if (user) {
            setUserData(user);
            setFormData({
              name: user.name,
              institution: user.institution,
              department: user.department,
              location: user.location
            });
            setSelectedIl(user.location.il);
            setAvailableIlceler(ilceler[user.location.il as keyof typeof ilceler] || []);
          }
        } catch (error) {
          console.error('Kullanıcı bilgileri yüklenirken hata:', error);
          setError('Kullanıcı bilgileri yüklenemedi.');
        }
      }
    };

    loadUserData();
  }, [currentUser]);

  useEffect(() => {
    if (selectedIl) {
      setAvailableIlceler(ilceler[selectedIl as keyof typeof ilceler] || []);
      if (!ilceler[selectedIl as keyof typeof ilceler]?.includes(formData.location.ilce)) {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            ilce: ''
          }
        }));
      }
    }
  }, [selectedIl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'il') {
      setSelectedIl(value);
      setFormData(prev => ({
        ...prev,
        location: {
          il: value,
          ilce: ''
        }
      }));
    } else if (name === 'ilce') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          ilce: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    setError('');

    try {
      await userService.updateUser(currentUser.uid, formData);
      const updatedUser = await userService.getUser(currentUser.uid);
      setUserData(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      setError('Profil güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setPasswordError('');
    setPasswordSuccess('');

    // Şifre doğrulamaları
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Yeni şifre ve tekrarı eşleşmiyor.');
      return;
    }

    try {
      // Önce kullanıcıyı yeniden doğrula
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        passwordForm.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Şifreyi güncelle
      await updatePassword(currentUser, passwordForm.newPassword);
      setPasswordSuccess('Şifreniz başarıyla güncellendi.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
    } catch (error: any) {
      console.error('Şifre güncellenirken hata:', error);
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Mevcut şifreniz yanlış.');
      } else {
        setPasswordError('Şifre güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  if (!userData) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profil Başlığı */}
          <div className="bg-blue-500 h-32 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white">
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt={userData.name}
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl text-gray-500">
                      {userData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditing ? 'İptal' : 'Düzenle'}
              </button>
            </div>
          </div>

          {/* Profil Bilgileri */}
          <div className="px-8 py-6 pt-16">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                    Çalıştığınız Kurum
                  </label>
                  <input
                    type="text"
                    name="institution"
                    id="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Departman
                  </label>
                  <input
                    type="text"
                    name="department"
                    id="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="il" className="block text-sm font-medium text-gray-700">
                      İl
                    </label>
                    <select
                      name="il"
                      id="il"
                      value={formData.location.il}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">İl Seçin</option>
                      {Object.keys(iller).map(il => (
                        <option key={il} value={il}>
                          {il}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ilce" className="block text-sm font-medium text-gray-700">
                      İlçe
                    </label>
                    <select
                      name="ilce"
                      id="ilce"
                      value={formData.location.ilce}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">İlçe Seçin</option>
                      {availableIlceler.map(ilce => (
                        <option key={ilce} value={ilce}>
                          {ilce}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{userData.name}</h3>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Çalıştığınız Kurum</h4>
                    <p className="mt-1 text-sm text-gray-900">{userData.institution}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Departman</h4>
                    <p className="mt-1 text-sm text-gray-900">{userData.department}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">İl</h4>
                    <p className="mt-1 text-sm text-gray-900">{userData.location.il}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">İlçe</h4>
                    <p className="mt-1 text-sm text-gray-900">{userData.location.ilce}</p>
                  </div>
                </div>

                {/* Şifre Değiştirme Bölümü */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Şifre Değiştirme</h3>
                    <button
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {showPasswordChange ? 'İptal' : 'Şifre Değiştir'}
                    </button>
                  </div>

                  {showPasswordChange && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      {passwordError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                          {passwordError}
                        </div>
                      )}
                      {passwordSuccess && (
                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                          {passwordSuccess}
                        </div>
                      )}

                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          Mevcut Şifre
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          Yeni Şifre
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          minLength={6}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Yeni Şifre Tekrar
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          minLength={6}
                          required
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Şifreyi Güncelle
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 