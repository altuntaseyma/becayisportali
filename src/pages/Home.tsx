import { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [activeTab, setActiveTab] = useState('becayis');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Kamu Becayiş Platformu</h1>
          <p className="text-xl mb-8">657 sayılı Devlet Memurları Kanunu kapsamında güvenli ve kolay becayiş imkanı</p>
          <Link 
            to="/becayis" 
            className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Becayiş İsteği Oluştur
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('becayis')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'becayis' 
                ? 'bg-blue-900 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Becayiş İstekleri
          </button>
          <button
            onClick={() => setActiveTab('haberler')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'haberler' 
                ? 'bg-blue-900 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Haberler
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'forum' 
                ? 'bg-blue-900 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Forum
          </button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {activeTab === 'becayis' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">Son Becayiş İstekleri</h2>
                <div className="space-y-4">
                  {/* Örnek Becayiş İstekleri */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold">İstanbul - Ankara Becayiş İsteği</h3>
                    <p className="text-gray-600">İstanbul'da çalışan bir öğretmen, Ankara'ya tayin istiyor.</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <span>İlan Tarihi: 15.03.2024</span>
                    </div>
                  </div>
                  {/* Diğer istekler buraya eklenecek */}
                </div>
              </div>
            )}

            {activeTab === 'haberler' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">Son Haberler</h2>
                <div className="space-y-4">
                  {/* Örnek Haberler */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold">2024 Yılı Becayiş Takvimi Açıklandı</h3>
                    <p className="text-gray-600">2024 yılı için becayiş başvuru tarihleri ve kriterleri belirlendi.</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <span>Yayın Tarihi: 14.03.2024</span>
                    </div>
                  </div>
                  {/* Diğer haberler buraya eklenecek */}
                </div>
              </div>
            )}

            {activeTab === 'forum' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">Forum Konuları</h2>
                <div className="space-y-4">
                  {/* Örnek Forum Konuları */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold">Becayiş Sürecinde Dikkat Edilmesi Gerekenler</h3>
                    <p className="text-gray-600">Becayiş başvurusu yaparken dikkat edilmesi gereken önemli noktalar...</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <span>Son Cevap: 13.03.2024</span>
                    </div>
                  </div>
                  {/* Diğer forum konuları buraya eklenecek */}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Chatbot</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 mb-4">Becayiş sürecinizle ilgili sorularınız için chatbot'u kullanabilirsiniz.</p>
                <button className="w-full bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
                  Chatbot'u Başlat
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Hızlı İstatistikler</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Aktif Becayiş İstekleri</span>
                  <span className="font-semibold">150</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Başarılı Becayişler</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Forum Konuları</span>
                  <span className="font-semibold">89</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 