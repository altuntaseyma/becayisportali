import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { validation } from '../utils/validation';
import { kurumKategorileri, kurumlar, iller, ilceler } from '../data/turkiyeData';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { User, UserLocation } from '../types/user';

interface RegisterFormData {
  displayName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  kurum: string;
  kurumKategorisi: string;
  il: string;
  ilce: string;
  department: string;
  title: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [availableIlceler, setAvailableIlceler] = useState<string[]>([]);
  const [availableKurumlar, setAvailableKurumlar] = useState<string[]>([]);
  const [formData, setFormData] = useState<RegisterFormData>({
    displayName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    kurum: '',
    kurumKategorisi: '',
    il: '',
    ilce: '',
    department: '',
    title: ''
  });

  useEffect(() => {
    if (formData.il) {
      setAvailableIlceler(ilceler[formData.il] || []);
      setFormData(prev => ({ ...prev, ilce: '' }));
    }
  }, [formData.il]);

  useEffect(() => {
    if (formData.kurumKategorisi) {
      setAvailableKurumlar(kurumlar[formData.kurumKategorisi] || []);
      setFormData(prev => ({ ...prev, kurum: '' }));
    }
  }, [formData.kurumKategorisi]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Kayıt işlemi başlatılıyor...');
    console.log('Form verileri:', formData);

    try {
      setLoading(true);

      // Form verilerini doğrula
      if (!validation.isValidEmail(formData.email)) {
        showToast('Geçerli bir e-posta adresi giriniz.', 'error');
        return;
      }

      if (!validation.isValidPassword(formData.password)) {
        showToast('Şifre en az 6 karakter olmalıdır.', 'error');
        return;
      }

      if (formData.password !== formData.passwordConfirm) {
        showToast('Şifreler eşleşmiyor.', 'error');
        return;
      }

      if (!formData.department) {
        showToast('Departman alanı zorunludur.', 'error');
        return;
      }

      if (!formData.title) {
        showToast('Unvan/Pozisyon alanı zorunludur.', 'error');
        return;
      }

      // Authentication işlemi
      console.log('Authentication başlatılıyor...');
      
      // Firestore'a kaydedilecek kullanıcı verilerini hazırla
      const userData: Partial<User> = {
        email: formData.email,
        displayName: formData.displayName,
        fullName: formData.displayName,
        currentLocation: {
          city: formData.il,
          district: formData.ilce
        },
        location: {
          il: formData.il,
          ilce: formData.ilce
        },
        institution: formData.kurum,
        institutionCategory: formData.kurumKategorisi,
        department: formData.department,
        title: formData.title,
        isVerified: false,
        desiredLocations: []
      };

      console.log('Firestore\'a kaydedilecek veriler:', userData);

      // Kullanıcıyı kaydet
      await register(formData.email, formData.password, userData);

      showToast('Hesabınız başarıyla oluşturuldu!', 'success');
      console.log('Kullanıcı başarıyla oluşturuldu ve veritabanına kaydedildi');
      navigate('/');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      showToast('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Yeni Hesap Oluştur
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Becayiş platformuna hoş geldiniz
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Ad Soyad
              </label>
              <div className="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta Adresi
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
                Şifre Tekrar
              </label>
              <div className="mt-1">
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="kurumKategorisi" className="block text-sm font-medium text-gray-700">
                Kurum Kategorisi
              </label>
              <div className="mt-1 relative">
                <select
                  id="kurumKategorisi"
                  name="kurumKategorisi"
                  required
                  value={formData.kurumKategorisi}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">Seçiniz</option>
                  {kurumKategorileri.map((kategori) => (
                    <option key={kategori} value={kategori}>{kategori}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="kurum" className="block text-sm font-medium text-gray-700">
                Kurum
              </label>
              <div className="mt-1 relative">
                {formData.kurumKategorisi === 'Diğer Kamu Kurumları' ? (
                  <input
                    type="text"
                    id="kurum"
                    name="kurum"
                    required
                    value={formData.kurum}
                    onChange={handleChange}
                    placeholder="Kurumunuzun adını giriniz"
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  />
                ) : (
                  <select
                    id="kurum"
                    name="kurum"
                    required
                    value={formData.kurum}
                    onChange={handleChange}
                    disabled={!formData.kurumKategorisi}
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Seçiniz</option>
                    {availableKurumlar.map((kurum) => (
                      <option key={kurum} value={kurum}>{kurum}</option>
                    ))}
                  </select>
                )}
                {formData.kurumKategorisi !== 'Diğer Kamu Kurumları' && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="il" className="block text-sm font-medium text-gray-700">
                  İl
                </label>
                <div className="mt-1 relative">
                  <select
                    id="il"
                    name="il"
                    required
                    value={formData.il}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="">Seçiniz</option>
                    {iller.map((il) => (
                      <option key={il} value={il}>{il}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="ilce" className="block text-sm font-medium text-gray-700">
                  İlçe
                </label>
                <div className="mt-1 relative">
                  <select
                    id="ilce"
                    name="ilce"
                    required
                    value={formData.ilce}
                    onChange={handleChange}
                    disabled={!formData.il || !availableIlceler.length}
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Seçiniz</option>
                    {availableIlceler.map((ilce) => (
                      <option key={ilce} value={ilce}>{ilce}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                {formData.il && !availableIlceler.length && (
                  <p className="mt-1 text-xs text-amber-500">
                    Bu il için ilçe verisi henüz eklenmemiştir. Lütfen sistem yöneticisi ile iletişime geçin.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Departman
              </label>
              <div className="mt-1">
                <input
                  id="department"
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Unvan / Pozisyon
              </label>
              <div className="mt-1">
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Zaten hesabınız var mı?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-primary-300 rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 