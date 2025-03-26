import React, { useState } from 'react';
import { userService } from '../services/userService';

const Migration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMigration = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await userService.migrateUserLocations();
      setSuccess('Kullanıcı konum verileri başarıyla güncellendi.');
    } catch (error) {
      console.error('Migration hatası:', error);
      setError('Kullanıcı konum verileri güncellenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Veri Taşıma</h1>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Kullanıcı Konum Verilerini Güncelle</h2>
              <p className="mt-1 text-sm text-gray-500">
                Bu işlem, eski formattaki kullanıcı konum verilerini yeni formata dönüştürecektir.
              </p>
            </div>

            <button
              onClick={handleMigration}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Güncelleniyor...' : 'Güncellemeyi Başlat'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Migration; 