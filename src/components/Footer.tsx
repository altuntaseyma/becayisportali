import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Becayiş Portalı</h3>
            <p className="text-gray-300">
              Güvenli ve kolay becayiş platformu
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Ana Sayfa</a></li>
              <li><a href="/exchange" className="text-gray-300 hover:text-white">Becayiş</a></li>
              <li><a href="/forum" className="text-gray-300 hover:text-white">Forum</a></li>
              <li><a href="/news" className="text-gray-300 hover:text-white">Haberler</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@becayisportali.com</li>
              <li>Tel: +90 (XXX) XXX XX XX</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Becayiş Portalı. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 