import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { kurumKategorileri, kurumlar, iller, ilceler } from '../data/turkiyeData';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface RegisterFormData {
  fullName: string;
  email: string;
  kurumKategorisi: string;
  kurumTuru: string;
  il: string;
  ilce: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    kurumKategorisi: '',
    kurumTuru: '',
    il: '',
    ilce: '',
    password: '',
    confirmPassword: ''
  });

  const [availableKurumTurleri, setAvailableKurumTurleri] = useState<string[]>([]);
  const [availableIlceler, setAvailableIlceler] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.kurumKategorisi) {
      setAvailableKurumTurleri(kurumlar[formData.kurumKategorisi as keyof typeof kurumlar] || []);
      setFormData(prev => ({ ...prev, kurumTuru: '' }));
    }
  }, [formData.kurumKategorisi]);

  useEffect(() => {
    if (formData.il) {
      setAvailableIlceler(ilceler[formData.il] || []);
      setFormData(prev => ({ ...prev, ilce: '' }));
    }
  }, [formData.il]);

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const isLongEnough = password.length >= 6;
    
    if (!hasUpperCase) return 'Şifre en az 1 büyük harf içermelidir';
    if (!hasLowerCase) return 'Şifre en az 1 küçük harf içermelidir';
    if (!isLongEnough) return 'Şifre en az 6 karakter uzunluğunda olmalıdır';
    
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      const passwordError = validatePassword(value);
      if (passwordError) {
        setError(passwordError);
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError('Şifreler eşleşmiyor');
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      return setError(passwordError);
    }

    try {
      setError('');
      setLoading(true);
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      setError('Hesap oluşturulurken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.');
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
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Ad Soyad
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
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
              <label htmlFor="kurumTuru" className="block text-sm font-medium text-gray-700">
                Kurum
              </label>
              <div className="mt-1 relative">
                {formData.kurumKategorisi === 'Diğer Kamu Kurumları' ? (
                  <input
                    type="text"
                    id="kurumTuru"
                    name="kurumTuru"
                    required
                    value={formData.kurumTuru}
                    onChange={handleChange}
                    placeholder="Kurumunuzun adını giriniz"
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  />
                ) : (
                  <select
                    id="kurumTuru"
                    name="kurumTuru"
                    required
                    value={formData.kurumTuru}
                    onChange={handleChange}
                    disabled={!formData.kurumKategorisi}
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Seçiniz</option>
                    {availableKurumTurleri.map((kurum) => (
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                En az 6 karakter, 1 büyük ve 1 küçük harf içermelidir
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Şifre Tekrar
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Hesap Oluştur
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
} 