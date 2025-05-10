import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MatchPair, MatchPreference, MatchScore } from '../types/matching';
import { User } from '../types/database';

// Basit bir bildirim fonksiyonu (ileride e-posta veya push notification ile değiştirilebilir)
async function notifyUser(userId: string, message: string) {
  // Burada gerçek bildirim servisine entegre edebilirsin
  console.log(`BİLDİRİM -> Kullanıcı: ${userId} | Mesaj: ${message}`);
}

export class MatchingService {
  private calculateLocationScore(location1: { city: string; district: string }, location2: { city: string; district: string }): number {
    if (location1.city === location2.city) {
      return location1.district === location2.district ? 1 : 0.8;
    }
    return 0;
  }

  private calculateInstitutionScore(type1: string, type2: string): number {
    return type1 === type2 ? 1 : 0;
  }

  private calculatePositionScore(position1: string, position2: string): number {
    return position1 === position2 ? 1 : 0;
  }

  private calculateMatchScore(preference1: MatchPreference, preference2: MatchPreference): MatchScore {
    const locationScore = this.calculateLocationScore(
      preference1.currentLocation,
      preference2.targetLocation
    );

    const institutionScore = this.calculateInstitutionScore(
      preference1.institutionType,
      preference2.institutionType
    );

    const positionScore = this.calculatePositionScore(
      preference1.position,
      preference2.position
    );

    // Ağırlıklı toplam skor hesaplama
    const totalScore = (
      locationScore * 0.5 +     // Konum: %50 ağırlık
      institutionScore * 0.3 +  // Kurum tipi: %30 ağırlık
      positionScore * 0.2       // Pozisyon: %20 ağırlık
    );

    return {
      locationScore,
      institutionScore,
      positionScore,
      totalScore
    };
  }

  async findPotentialMatches(userPreference: MatchPreference): Promise<MatchPair[]> {
    const matches: MatchPair[] = [];
    const usersRef = collection(db, 'users');
    
    // Eksik alan kontrolü (userPreference)
    if (!userPreference?.currentLocation?.city || !userPreference?.currentLocation?.district || !userPreference?.targetLocation?.city || !userPreference?.targetLocation?.district || !userPreference?.institutionType || !userPreference?.position) {
      console.error('Kullanıcı tercihlerinde zorunlu alan(lar) eksik, eşleşme yapılmayacak.');
      return matches;
    }
    
    // Hedef şehri kullanıcının bulunduğu şehir olan kullanıcıları bul
    const q = query(
      usersRef,
      where('hedefIl', '==', userPreference.currentLocation.city)
    );

    const querySnapshot = await getDocs(q);
    
    for (const doc of querySnapshot.docs) {
      const matchData = doc.data();
      
      // Kendisi hariç
      if (doc.id === userPreference.userId) continue;

      // Karşılıklı eşleşme kontrolü
      if (matchData.il === userPreference.targetLocation.city) {
        const matchPreference: MatchPreference = {
          userId: doc.id,
          currentLocation: {
            city: matchData.il || '',
            district: matchData.ilce || ''
          },
          targetLocation: {
            city: matchData.hedefIl || '',
            district: matchData.hedefIlce || ''
          },
          institutionType: matchData.kurumTuru || '',
          position: matchData.pozisyon || ''
        };

        // Eksik alan kontrolü (matchPreference)
        if (!matchPreference.currentLocation.city || !matchPreference.currentLocation.district || !matchPreference.targetLocation.city || !matchPreference.targetLocation.district || !matchPreference.institutionType || !matchPreference.position) {
          console.warn('Potansiyel eşleşme adayında zorunlu alan(lar) eksik, eşleşme yapılmayacak.');
          continue;
        }

        const score = this.calculateMatchScore(userPreference, matchPreference);

        // Minimum skor kontrolü (70%)
        if (score.totalScore >= 0.7) {
          const match: MatchPair = {
            id: doc.id,
            user1Id: userPreference.userId,
            user2Id: matchPreference.userId,
            score,
            status: 'pending',
            createdAt: new Date()
          };

          // Eşleşmeyi veritabanına kaydet
          await this.createMatch(match);
          // Bildirim gönder
          await notifyUser(userPreference.userId, 'Yeni bir becayiş eşleşmeniz oluştu!');
          await notifyUser(matchPreference.userId, 'Yeni bir becayiş eşleşmeniz oluştu!');
          matches.push(match);
        }
      }
    }

    return matches;
  }

  async createMatch(match: MatchPair): Promise<string> {
    const matchesRef = collection(db, 'matches');
    const docRef = await addDoc(matchesRef, {
      ...match,
      createdAt: Timestamp.fromDate(match.createdAt)
    });
    return docRef.id;
  }

  async getUserMatches(userId: string): Promise<MatchPair[]> {
    const matchesRef = collection(db, 'matches');
    const q = query(
      matchesRef,
      where('user1Id', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    })) as MatchPair[];
  }

  async getAllUserMatches(userId: string): Promise<MatchPair[]> {
    const matchesRef = collection(db, 'matches');
    const q1 = query(matchesRef, where('user1Id', '==', userId));
    const q2 = query(matchesRef, where('user2Id', '==', userId));

    const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const matches = [
      ...snapshot1.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate()
      })),
      ...snapshot2.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate()
      }))
    ];
    // Aynı eşleşme iki kez gelirse filtrele
    return matches.filter((match, index, self) =>
      index === self.findIndex((m) => m.id === match.id)
    ) as MatchPair[];
  }

  /**
   * Admin fonksiyonu: Tüm kullanıcıların istekleri arasında toplu eşleşme yapar.
   */
  async runBatchMatchingForAllUsers(): Promise<void> {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map(doc => ({ ...(doc.data() as User), id: doc.id }));

    for (const user of users) {
      // Kullanıcıdan MatchPreference oluştur
      const userPreference: MatchPreference = {
        userId: user.id,
        currentLocation: {
          city: user.location?.il || '',
          district: user.location?.ilce || ''
        },
        targetLocation: {
          city: '', // Eğer kullanıcıya ait hedef şehir bilgisi varsa buraya ekle, yoksa boş bırak
          district: ''
        },
        institutionType: user.institution || '',
        position: user.title || ''
      };
      // Potansiyel eşleşmeleri bul ve kaydet
      await this.findPotentialMatches(userPreference);
    }
  }
} 