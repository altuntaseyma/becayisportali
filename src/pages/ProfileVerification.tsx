import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { verificationService } from '../services/verificationService';

const pastelBg = 'bg-[#e3f0ff]';

const ProfileVerification = () => {
  const { currentUser } = useAuth();
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const frontImageRef = useRef<HTMLInputElement>(null);
  const backImageRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      if (side === 'front') {
        setFrontImage(file);
      } else {
        setBackImage(file);
      }
    }
  };

  const handleVerification = async () => {
    if (!frontImage || !backImage) {
      setError('Lütfen kimliğin ön ve arka yüzünü yükleyin.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await verificationService.verifyUser(
        currentUser?.uid || '',
        frontImage,
        backImage
      );

      if (result.success) {
        setSuccess('Kimlik doğrulama başarılı!');
        setTimeout(() => {
          window.location.href = '/profile';
        }, 2000);
      } else {
        setError(result.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-start justify-center">
      <div className={`w-full max-w-4xl rounded-xl shadow-lg p-0 mt-16 ${pastelBg}`}>
        {/* Başlık kısmı */}
        <div className="rounded-t-xl px-6 py-4 bg-gradient-to-r from-[#b3d8fd] to-[#e3f0ff]">
          <h2 className="text-xl font-bold text-blue-900">Kimlik Doğrulama</h2>
        </div>
        <div className="flex flex-col gap-4 p-6">
          {/* Kullanıcı Yönergesi */}
          <div className="bg-[#d6eaff] border-l-4 border-blue-400 p-3 mb-2 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-xs font-medium text-blue-800 mb-1">Kimlik Doğrulama Yönergesi</h3>
                <ul className="list-disc pl-4 text-xs text-blue-700 space-y-0.5">
                  <li>Kimliğinizin ön ve arka yüzünü net bir şekilde fotoğraflayın.</li>
                  <li>Fotoğrafların aydınlık ve okunaklı olmasına dikkat edin.</li>
                  <li>Kimliğin tüm köşeleri görünür olmalı.</li>
                  <li>Fotoğrafları yükledikten sonra "Doğrula"ya tıklayın.</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Kimlik Ön Yüzü</label>
              <div className="flex justify-center px-2 pt-3 pb-3 border-2 border-blue-200 border-dashed rounded-lg bg-[#f0f6ff]">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-8 w-8 text-blue-300" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 text-xs">
                    <span>Fotoğraf Yükle</span>
                    <input
                      type="file"
                      ref={frontImageRef}
                      onChange={(e) => handleImageUpload(e, 'front')}
                      accept="image/*"
                      className="sr-only"
                    />
                  </label>
                  <p className="text-[10px] text-blue-400">PNG, JPG, GIF max 10MB</p>
                </div>
              </div>
              {frontImage && (
                <p className="text-xs text-blue-700">Seçilen dosya: {frontImage.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Kimlik Arka Yüzü</label>
              <div className="flex justify-center px-2 pt-3 pb-3 border-2 border-blue-200 border-dashed rounded-lg bg-[#f0f6ff]">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-8 w-8 text-blue-300" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 text-xs">
                    <span>Fotoğraf Yükle</span>
                    <input
                      type="file"
                      ref={backImageRef}
                      onChange={(e) => handleImageUpload(e, 'back')}
                      accept="image/*"
                      className="sr-only"
                    />
                  </label>
                  <p className="text-[10px] text-blue-400">PNG, JPG, GIF max 10MB</p>
                </div>
              </div>
              {backImage && (
                <p className="text-xs text-blue-700">Seçilen dosya: {backImage.name}</p>
              )}
            </div>
          </div>
          {error && (
            <div className="mt-2 text-red-500 text-xs bg-red-50 p-2 rounded-lg">{error}</div>
          )}
          {success && (
            <div className="mt-2 text-green-500 text-xs bg-green-50 p-2 rounded-lg">{success}</div>
          )}
          <div className="mt-3">
            <button
              onClick={handleVerification}
              disabled={loading || !frontImage || !backImage}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors text-sm bg-gradient-to-r from-[#b3d8fd] to-[#e3f0ff] shadow-md ${
                loading || !frontImage || !backImage
                  ? 'bg-gray-400 cursor-not-allowed bg-none'
                  : 'hover:from-blue-300 hover:to-blue-400'
              }`}
            >
              {loading ? 'İşleniyor...' : 'Doğrula'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVerification; 