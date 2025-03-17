import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { sehirler, kurumKategorileri } from '../data/turkiyeData';
import logo from '../assets/logo.svg';
import { FirebaseError } from 'firebase/app';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [kurumKategori, setKurumKategori] = useState('');
  const [kurum, setKurum] = useState('');
  const [sehir, setSehir] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword || !kurumKategori || !kurum || !sehir) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signup(email, password);
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        kurumKategori,
        kurum,
        sehir,
        createdAt: new Date().toISOString(),
        isEmailVerified: false
      });

      alert('Hesabınız başarıyla oluşturuldu!');
      navigate('/login');
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('Bu e-posta adresi zaten kullanımda.');
            break;
          case 'auth/invalid-email':
            setError('Geçersiz e-posta adresi.');
            break;
          case 'auth/operation-not-allowed':
            setError('E-posta/şifre girişi şu anda devre dışı.');
            break;
          case 'auth/network-request-failed':
            setError('Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.');
            break;
          default:
            setError('Hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin. Hata: ' + err.message);
        }
      } else {
        setError('Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-20 h-20 mb-4" />
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Hesap Oluştur
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Becayiş platformuna hoş geldiniz
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg" role="alert">
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
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta Adresi
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                  placeholder="E-posta adresinizi girin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                  placeholder="Şifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Şifre Tekrar
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="kurum-kategori" className="block text-sm font-medium text-gray-700">
                Kurum Kategorisi
              </label>
              <div className="mt-1">
                <select
                  id="kurum-kategori"
                  name="kurum-kategori"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                  value={kurumKategori}
                  onChange={(e) => {
                    setKurumKategori(e.target.value);
                    setKurum('');
                  }}
                >
                  <option value="">Seçiniz</option>
                  {Object.keys(kurumKategorileri).map((kategori) => (
                    <option key={kategori} value={kategori}>{kategori}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="kurum" className="block text-sm font-medium text-gray-700">
                Kurum
              </label>
              <div className="mt-1">
                <select
                  id="kurum"
                  name="kurum"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                  value={kurum}
                  onChange={(e) => setKurum(e.target.value)}
                  disabled={!kurumKategori}
                >
                  <option value="">Seçiniz</option>
                  {kurumKategori && kurumKategorileri[kurumKategori].map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="sehir" className="block text-sm font-medium text-gray-700">
                Şehir
              </label>
              <div className="mt-1">
                <select
                  id="sehir"
                  name="sehir"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                  value={sehir}
                  onChange={(e) => setSehir(e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {sehirler.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Hesap Oluştur'
              )}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Zaten hesabınız var mı? Giriş yapın
          </Link>
        </div>
      </div>
    </div>
  );
} 