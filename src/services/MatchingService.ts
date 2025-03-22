import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { MatchPair, MatchPreference, MatchScore } from '../types/matching';

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
            city: matchData.il,
            district: matchData.ilce
          },
          targetLocation: {
            city: matchData.hedefIl,
            district: matchData.hedefIlce
          },
          institutionType: matchData.kurumTuru,
          position: matchData.pozisyon
        };

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
} 