import { db } from '../config/firebase';
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, Timestamp, CollectionReference, Query } from 'firebase/firestore';
import { ExchangeRequest } from '../types/database';

interface ExchangeFilters {
  city?: string;
  onlyActive?: boolean;
}

class ExchangeService {
  private collection = 'exchangeRequests';

  async getExchangeRequests(filters: ExchangeFilters = {}): Promise<ExchangeRequest[]> {
    try {
      let baseQuery: Query = collection(db, this.collection);
      
      if (filters.city) {
        baseQuery = query(baseQuery, where('targetCity', '==', filters.city));
      }
      
      if (filters.onlyActive) {
        baseQuery = query(baseQuery, where('isActive', '==', true));
      }

      const querySnapshot = await getDocs(baseQuery);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as ExchangeRequest[];
    } catch (error) {
      console.error('Error getting exchange requests:', error);
      throw error;
    }
  }

  async createExchangeRequest(data: Omit<ExchangeRequest, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating exchange request:', error);
      throw error;
    }
  }

  async updateExchangeRequest(id: string, data: Partial<ExchangeRequest>): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating exchange request:', error);
      throw error;
    }
  }

  async deleteExchangeRequest(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting exchange request:', error);
      throw error;
    }
  }

  async getExchangeRequest(id: string): Promise<ExchangeRequest | null> {
    try {
      const docRef = doc(db, this.collection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return {
        ...docSnap.data(),
        id: docSnap.id,
        createdAt: docSnap.data().createdAt.toDate(),
        updatedAt: docSnap.data().updatedAt.toDate()
      } as ExchangeRequest;
    } catch (error) {
      console.error('Error getting exchange request:', error);
      throw error;
    }
  }

  async getUserExchangeRequests(userId: string): Promise<ExchangeRequest[]> {
    try {
      const q = query(collection(db, this.collection), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as ExchangeRequest[];
    } catch (error) {
      console.error('Error getting user exchange requests:', error);
      throw error;
    }
  }
}

export const exchangeService = new ExchangeService(); 