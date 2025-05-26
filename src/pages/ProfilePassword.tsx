import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const ProfilePassword = () => {
  const { updatePassword } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      showToast('Yeni şifreler eşleşmiyor', 'error');
      return;
    }

    try {
      setSaving(true);
      await updatePassword(formData.currentPassword, formData.newPassword);
      showToast('Şifreniz başarıyla güncellendi', 'success');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      showToast('Şifre güncellenirken bir hata oluştu', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-8 tracking-tight text-gray-900">Şifre Değiştir</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mevcut Şifre</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Yeni Şifre</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Yeni Şifre (Tekrar)</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            minLength={6}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePassword; 