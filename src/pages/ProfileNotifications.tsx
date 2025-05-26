import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

const notificationTypes = [
  { id: 'email', name: 'E-posta Bildirimleri', description: 'Önemli güncellemeler ve değişiklikler için e-posta al' },
  { id: 'push', name: 'Anlık Bildirimler', description: 'Yeni eşleşme ve mesajlar için anlık bildirim al' },
  { id: 'sms', name: 'SMS Bildirimleri', description: 'Kritik güncellemeler için SMS al' },
];

const ProfileNotifications = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (id: string) => {
    setSettings(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      // TODO: API call to save notification settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      showToast('Bildirim ayarlarınız güncellendi', 'success');
    } catch (error) {
      showToast('Ayarlar güncellenirken bir hata oluştu', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-8 tracking-tight text-gray-900">Bildirim Ayarları</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {notificationTypes.map((type) => (
            <div key={type.id} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={type.id}
                  name={type.id}
                  type="checkbox"
                  checked={settings[type.id as keyof typeof settings]}
                  onChange={() => handleChange(type.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor={type.id} className="text-sm font-medium text-gray-700">
                  {type.name}
                </label>
                <p className="text-sm text-gray-500">{type.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileNotifications; 