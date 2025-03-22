import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  imageUrl?: string;
  category: string;
  publishedAt: Date;
}

export default function News() {
  const { currentUser } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'atama', name: 'Atama Haberleri' },
    { id: 'maas', name: 'Maaş Haberleri' },
    { id: 'egitim', name: 'Eğitim Haberleri' },
    { id: 'saglik', name: 'Sağlık Haberleri' },
    { id: 'diger', name: 'Diğer' }
  ];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    try {
      const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const newsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt.toDate()
      })) as NewsItem[];

      // Kategori filtreleme
      const filteredNews = selectedCategory === 'all'
        ? newsData
        : newsData.filter(item => item.category === selectedCategory);

      setNews(filteredNews);
    } catch (error) {
      console.error('Haberler yüklenirken hata:', error);
      setError('Haberler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Memur Haberleri</h1>
        <p className="mt-2 text-gray-600">
          Güncel memur haberlerini takip edin.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Kategori Filtreleme */}
      <div className="mb-8">
        <div className="sm:flex sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Haber Listesi */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {news.length > 0 ? (
          news.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {item.imageUrl && (
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {categories.find(c => c.id === item.category)?.name || 'Diğer'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {item.publishedAt.toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {item.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Kaynak: {item.source}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Devamını Oku
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            Bu kategoride henüz haber bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
} 