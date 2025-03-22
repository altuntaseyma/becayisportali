import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface BecayisIlani {
  id: string;
  kurumAdi: string;
  sehir: string;
  unvan: string;
  aciklama: string;
  iletisim: string;
  olusturulmaTarihi: Date;
}

export default function Home() {
  const [ilanlar, setIlanlar] = useState<BecayisIlani[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIlanlar = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'becayisIlanlari'));
        const ilanlarData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          olusturulmaTarihi: doc.data().olusturulmaTarihi?.toDate()
        })) as BecayisIlani[];
        
        setIlanlar(ilanlarData);
      } catch (error) {
        console.error('İlanlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIlanlar();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Becayiş İlanları</h1>
        <p className="text-gray-600">
          Mevcut becayiş ilanlarını görüntüleyin veya kendi ilanınızı oluşturun.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : ilanlar.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900">Henüz ilan bulunmuyor</h3>
          <p className="mt-2 text-gray-600">İlk ilanı siz oluşturmak ister misiniz?</p>
          <button className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
            İlan Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ilanlar.map((ilan) => (
            <div key={ilan.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{ilan.kurumAdi}</h3>
                  <span className="px-3 py-1 text-sm text-primary-700 bg-primary-50 rounded-full">
                    {ilan.sehir}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600">Unvan</p>
                  <p className="text-gray-900">{ilan.unvan}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600">Açıklama</p>
                  <p className="text-gray-900 line-clamp-3">{ilan.aciklama}</p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    İletişime Geç
                  </button>
                  <span className="text-sm text-gray-500">
                    {ilan.olusturulmaTarihi?.toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 