import { db, storage } from '../config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  DocumentData,
  Query,
  Timestamp,
  orderBy,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ExchangeRequest, Message } from '../types/database';

interface ExchangeFilters {
  city?: string;
  onlyActive?: boolean;
}

interface AllExchangeFilters extends ExchangeFilters {
  sourceCity?: string;
  targetCity?: string;
  department?: string;
  institution?: string;
}

class ExchangeService {
  private collection = 'exchangeRequests';
  private messagesCollection = 'messages';

  async getExchangeRequests(filters: ExchangeFilters = {}): Promise<ExchangeRequest[]> {
    try {
      let q: Query<DocumentData> = collection(db, this.collection);
      const conditions = [];

      if (filters.city) {
        conditions.push(where('targetCity', '==', filters.city));
      }

      if (filters.onlyActive) {
        conditions.push(where('isActive', '==', true));
      }

      if (conditions.length > 0) {
        q = query(q, ...conditions);
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ExchangeRequest[];
    } catch (error) {
      console.error('Error fetching exchange requests:', error);
      throw error;
    }
  }

  async getAllExchangeRequests(filters: AllExchangeFilters = {}): Promise<ExchangeRequest[]> {
    try {
      const conditions = [];

      if (filters.sourceCity) {
        conditions.push(where('currentCity', '==', filters.sourceCity));
      }
      if (filters.targetCity) {
        conditions.push(where('targetCities', 'array-contains', { il: filters.targetCity }));
      }
      if (filters.department) {
        conditions.push(where('department', '==', filters.department));
      }
      if (filters.institution) {
        conditions.push(where('institution', '==', filters.institution));
      }
      if (filters.onlyActive) {
        conditions.push(where('isActive', '==', true));
      }

      const q = query(
        collection(db, this.collection),
        ...conditions,
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          userEmail: '***',
          userPhone: '***',
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as ExchangeRequest;
      });
    } catch (error) {
      console.error('Error getting all exchange requests:', error);
      throw error;
    }
  }

  async createExchangeRequest(data: Omit<ExchangeRequest, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...data,
        matches: [],
        documents: [],
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
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as ExchangeRequest[];
    } catch (error) {
      console.error('Error getting user exchange requests:', error);
      throw error;
    }
  }

  async uploadDocument(requestId: string, file: File, type: string): Promise<void> {
    try {
      const storageRef = ref(storage, `documents/${requestId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const docRef = doc(db, this.collection, requestId);
      await updateDoc(docRef, {
        documents: arrayUnion({
          type,
          url,
          name: file.name,
          uploadedAt: Timestamp.now()
        })
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async updateMatchStatus(
    requestId: string,
    matchId: string,
    status: 'accepted' | 'rejected'
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collection, requestId);
      const request = await getDoc(docRef);
      const data = request.data();

      if (!data) throw new Error('Request not found');

      const matches = data.matches || [];
      const matchIndex = matches.findIndex((m: any) => m.requestId === matchId);

      if (matchIndex === -1) throw new Error('Match not found');

      matches[matchIndex].status = status;
      matches[matchIndex].timestamp = Timestamp.now();

      await updateDoc(docRef, { matches });
    } catch (error) {
      console.error('Error updating match status:', error);
      throw error;
    }
  }

  async sendMessage(message: Omit<Message, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.messagesCollection), {
        ...message,
        read: false,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessages(exchangeRequestId: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, this.messagesCollection),
        where('exchangeRequestId', '==', exchangeRequestId),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Message[];
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  async checkForMatches(request: ExchangeRequest): Promise<ExchangeRequest[]> {
    try {
      const matches: ExchangeRequest[] = [];

      for (const target of request.targetCities) {
        const q = query(
          collection(db, this.collection),
          where('isActive', '==', true),
          where('userId', '!=', request.userId),
          where('currentCity', '==', target.il),
          where('targetCities', 'array-contains', { il: request.currentCity })
        );

        const querySnapshot = await getDocs(q);
        const potentialMatches = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            userEmail: '***',
            userPhone: '***',
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          }))
          .filter(match => {
            const data = match as ExchangeRequest;
            return data.department === request.department &&
              data.institution === request.institution &&
              data.position === request.position &&
              data.serviceClass === request.serviceClass;
          }) as ExchangeRequest[];

        matches.push(...potentialMatches);
      }

      return matches;
    } catch (error) {
      console.error('Error checking for matches:', error);
      throw error;
    }
  }
}

export const exchangeService = new ExchangeService(); 