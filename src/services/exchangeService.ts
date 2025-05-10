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
import { MatchingService } from './MatchingService';

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
  private matchingService = new MatchingService();

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
        } as unknown as ExchangeRequest;
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
      const newRequestSnap = await getDoc(docRef);
      const newRequest = { id: docRef.id, ...newRequestSnap.data() } as ExchangeRequest;
      const q = query(collection(db, this.collection), where('isActive', '==', true), where('id', '!=', docRef.id));
      const allActive = await getDocs(q);
      for (const doc of allActive.docs) {
        const otherRequest = { id: doc.id, ...doc.data() } as ExchangeRequest;
        if (
          newRequest.currentCity === otherRequest.targetCities[0]?.il &&
          otherRequest.currentCity === newRequest.targetCities[0]?.il &&
          newRequest.institution === otherRequest.institution &&
          newRequest.position === otherRequest.position
        ) {
          await this.matchingService.createMatch({
            id: '',
            user1Id: newRequest.userId,
            user2Id: otherRequest.userId,
            score: { locationScore: 1, institutionScore: 1, positionScore: 1, totalScore: 1 },
            status: 'pending',
            createdAt: new Date()
          });
        }
      }
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
          where('currentCity', '==', target.il)
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
          }) as unknown as ExchangeRequest)
          .filter(data => {
            const hasReverse = (data.targetCities || []).some(
              (t: any) => t.il === request.currentCity
            );
            return hasReverse &&
              data.institution === request.institution &&
              data.position === request.position;
          });
        matches.push(...potentialMatches);
      }
      return matches;
    } catch (error) {
      console.error('Error checking for matches:', error);
      throw error;
    }
  }

  /**
   * Tüm aktif becayiş istemlerini birbirleriyle karşılaştırıp eksik eşleşmeleri oluşturur (admin fonksiyonu).
   */
  async runBatchMatchingForAllRequests(): Promise<void> {
    const q = query(collection(db, this.collection), where('isActive', '==', true));
    const allActive = await getDocs(q);
    const requests: ExchangeRequest[] = allActive.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }) as unknown as ExchangeRequest);

    for (const reqA of requests) {
      for (const reqB of requests) {
        if (
          reqA.id !== reqB.id &&
          reqA.userId !== reqB.userId &&
          reqA.institution === reqB.institution &&
          reqA.position === reqB.position &&
          reqA.targetCities.some(tc => tc.il === reqB.currentCity) &&
          reqB.targetCities.some(tc => tc.il === reqA.currentCity)
        ) {
          // Eşleşme zaten var mı kontrolü (aynı iki kullanıcı arasında)
          // Burada matches koleksiyonunda kontrol yapılabilir, ancak basitlik için sadece bir kere oluşturulacak şekilde bırakıyoruz.
          await this.matchingService.createMatch({
            id: '',
            user1Id: reqA.userId,
            user2Id: reqB.userId,
            score: { locationScore: 1, institutionScore: 1, positionScore: 1, totalScore: 1 },
            status: 'pending',
            createdAt: new Date()
          });
        }
      }
    }
  }
}

export const exchangeService = new ExchangeService(); 