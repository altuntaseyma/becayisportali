import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { kurumKategorileri, kurumlar, iller, ilceler } from '../data/turkiyeData';
import { unvanlar } from '../data/unvanlar';
import { Timestamp } from 'firebase/firestore';

const ProfileInfo: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableIlceler, setAvailableIlceler] = useState<string[]>([]);
  const [availableKurumlar, setAvailableKurumlar] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    institutionCategory: '',
    institution: '',
    department: '',
    title: '',
    il: '',
    ilce: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const userData = await userService.getUser(currentUser.uid);
        if (!userData) throw new Error('Kullanıcı bulunamadı.');
        setFormData({
          displayName: userData.displayName || '',
          email: userData.email || '',
          institutionCategory: userData.institutionCategory || '',
          institution: userData.institution || '',
          department: userData.department || '',
          title: userData.title || '',
          il: userData.currentLocation?.city || '',
          ilce: userData.currentLocation?.district || ''
        });
      } catch (err) {
        setError('Kullanıcı bilgileri alınamadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [currentUser]);

  useEffect(() => {
    if (formData.il) {
      setAvailableIlceler(ilceler[formData.il] || []);
    }
  }, [formData.il]);

  useEffect(() => {
    if (formData.institutionCategory) {
      setAvailableKurumlar(kurumlar[formData.institutionCategory] || []);
    }
  }, [formData.institutionCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await userService.updateUser(currentUser.uid, {
        displayName: formData.displayName,
        institutionCategory: formData.institutionCategory,
        institution: formData.institution,
        department: formData.department,
        title: formData.title,
        currentLocation: {
          city: formData.il,
          district: formData.ilce
        },
        updatedAt: Timestamp.now()
      });
      setSuccess(true);
    } catch (err) {
      setError('Bilgiler kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-8 tracking-tight text-gray-900">Profil Bilgileri</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">E-posta</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="mt-1 block w-full border border-gray-200 bg-gray-100 rounded-md shadow-sm py-2 px-3 text-gray-400 cursor-not-allowed sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kurum Kategorisi</label>
          <select
            name="institutionCategory"
            value={formData.institutionCategory}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">Seçiniz</option>
            {kurumKategorileri.map((kategori) => (
              <option key={kategori} value={kategori}>{kategori}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kurum</label>
          <select
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            disabled={!formData.institutionCategory}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            required
          >
            <option value="">Seçiniz</option>
            {availableKurumlar.map((kurum) => (
              <option key={kurum} value={kurum}>{kurum}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Departman</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unvan/Pozisyon</label>
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">Seçiniz</option>
            {unvanlar.map((unvan) => (
              <option key={unvan} value={unvan}>{unvan}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">İl</label>
          <select
            name="il"
            value={formData.il}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">Seçiniz</option>
            {iller.map((il) => (
              <option key={il} value={il}>{il}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">İlçe</label>
          <select
            name="ilce"
            value={formData.ilce}
            onChange={handleChange}
            disabled={!formData.il}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            required
          >
            <option value="">Seçiniz</option>
            {availableIlceler.map((ilce) => (
              <option key={ilce} value={ilce}>{ilce}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">Bilgiler başarıyla kaydedildi.</div>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo; 