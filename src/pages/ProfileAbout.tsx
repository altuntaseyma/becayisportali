import React from 'react';

const ProfileAbout = () => {
  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-8 tracking-tight text-gray-900">Uygulama Hakkında</h2>
      <div className="prose prose-blue max-w-none">
        <p className="text-gray-600 mb-6">
          Becayiş Portalı, eğitim kurumları arasında personel becayişlerini kolaylaştırmak için tasarlanmış modern bir platformdur.
        </p>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Özellikler</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Kolay ve hızlı becayiş talebi oluşturma</li>
          <li>Otomatik eşleşme sistemi</li>
          <li>Güvenli iletişim platformu</li>
          <li>Gerçek zamanlı bildirimler</li>
          <li>Detaylı arama ve filtreleme seçenekleri</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Versiyon</h3>
        <p className="text-gray-600">1.0.0</p>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">İletişim</h3>
        <p className="text-gray-600">
          Soru, öneri ve şikayetleriniz için{' '}
          <a href="mailto:destek@becayisportali.com" className="text-blue-600 hover:text-blue-800">
            destek@becayisportali.com
          </a>{' '}
          adresine e-posta gönderebilirsiniz.
        </p>
      </div>
    </div>
  );
};

export default ProfileAbout; 