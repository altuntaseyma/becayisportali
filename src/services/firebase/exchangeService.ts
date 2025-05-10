import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { UserLocation } from '../../types/user';

export interface ExchangeRequest {
  id?: string;
  userId: string;
  currentLocation: UserLocation;
  desiredLocations: UserLocation[];
  status: 'active' | 'pending' | 'matched' | 'completed' | 'cancelled';
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const exchangeService = {
  async createRequest(request: Omit<ExchangeRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'exchangeRequests'), {
        ...request,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Becayiş isteği oluşturulamadı:', error);
      throw error;
    }
  },

  async getRequest(requestId: string): Promise<ExchangeRequest | null> {
    try {
      const docRef = doc(db, 'exchangeRequests', requestId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ExchangeRequest;
      }
      return null;
    } catch (error) {
      console.error('Becayiş isteği alınamadı:', error);
      throw error;
    }
  },

  async getUserRequests(userId: string): Promise<ExchangeRequest[]> {
    try {
      const q = query(
        collection(db, 'exchangeRequests'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ExchangeRequest));
    } catch (error) {
      console.error('Kullanıcının becayiş istekleri alınamadı:', error);
      throw error;
    }
  },

  async getMatchingRequests(location: UserLocation): Promise<ExchangeRequest[]> {
    try {
      const q = query(
        collection(db, 'exchangeRequests'),
        where('status', '==', 'active'),
        where('desiredLocations', 'array-contains', location)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ExchangeRequest));
    } catch (error) {
      console.error('Eşleşen becayiş istekleri alınamadı:', error);
      throw error;
    }
  },

  async updateRequest(requestId: string, updates: Partial<ExchangeRequest>): Promise<void> {
    try {
      const docRef = doc(db, 'exchangeRequests', requestId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Becayiş isteği güncellenemedi:', error);
      throw error;
    }
  },

  async deleteRequest(requestId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'exchangeRequests', requestId));
    } catch (error) {
      console.error('Becayiş isteği silinemedi:', error);
      throw error;
    }
  }
}; 