import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  orderBy
} from 'firebase/firestore';
import { db } from './config';

export interface Match {
  id?: string;
  user1Id: string;
  user2Id: string;
  exchangeRequest1Id: string;
  exchangeRequest2Id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
  lastActionBy?: string;
  notes?: string;
}

export const matchService = {
  async createMatch(match: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'matches'), {
        ...match,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Eşleşme oluşturulamadı:', error);
      throw error;
    }
  },

  async getMatch(matchId: string): Promise<Match | null> {
    try {
      const docRef = doc(db, 'matches', matchId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Match;
      }
      return null;
    } catch (error) {
      console.error('Eşleşme bilgileri alınamadı:', error);
      throw error;
    }
  },

  async getUserMatches(userId: string): Promise<Match[]> {
    try {
      const q = query(
        collection(db, 'matches'),
        where('user1Id', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const q2 = query(
        collection(db, 'matches'),
        where('user2Id', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const [snapshot1, snapshot2] = await Promise.all([
        getDocs(q),
        getDocs(q2)
      ]);
      
      const matches = [
        ...snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match)),
        ...snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match))
      ];
      
      // Tarihe göre sırala
      return matches.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Kullanıcının eşleşmeleri alınamadı:', error);
      throw error;
    }
  },

  async updateMatch(matchId: string, updates: Partial<Match>): Promise<void> {
    try {
      const docRef = doc(db, 'matches', matchId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Eşleşme güncellenemedi:', error);
      throw error;
    }
  },

  async getPendingMatches(userId: string): Promise<Match[]> {
    try {
      const q = query(
        collection(db, 'matches'),
        where('status', '==', 'pending'),
        where('user2Id', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Match));
    } catch (error) {
      console.error('Bekleyen eşleşmeler alınamadı:', error);
      throw error;
    }
  }
}; 