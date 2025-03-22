import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import Header from '../components/Header';

interface UserData {
  email: string;
  kurum: string;
  sehir: string;
  hedefSehirler: string[];
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDocs(query(
            collection(db, 'users'),
            where('email', '==', currentUser.email)
          ));

          if (!userDoc.empty) {
            const userData = userDoc.docs[0].data() as UserData;
            setUserData(userData);

            // Potansiyel eşleşmeleri bul
            const matchesQuery = query(
              collection(db, 'users'),
              where('sehir', 'in', userData.hedefSehirler),
              where('hedefSehirler', 'array-contains', userData.sehir)
            );

            const matchesSnapshot = await getDocs(matchesQuery);
            const matches = matchesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            setPotentialMatches(matches);
          }
        } catch (error) {
          console.error('Veri çekilirken hata oluştu:', error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Profil Bilgileri */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Profil Bilgileri
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData?.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Kurum</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData?.kurum}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Bulunduğu Şehir</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData?.sehir}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Hedef Şehirler</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userData?.hedefSehirler.join(', ') || 'Hedef şehir belirtilmemiş'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Potansiyel Eşleşmeler */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Potansiyel Becayiş Eşleşmeleri
              </h3>
            </div>
            <div className="border-t border-gray-200">
              {potentialMatches.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {potentialMatches.map((match) => (
                    <li key={match.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {match.kurum}
                          </p>
                          <p className="text-sm text-gray-500">
                            {match.sehir} → {userData?.sehir}
                          </p>
                        </div>
                        <div>
                          <button className="btn-primary">
                            İletişime Geç
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                  Henüz bir eşleşme bulunamadı.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 