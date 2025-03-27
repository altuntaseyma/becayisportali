import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, getDoc, getDocs, query, where, doc, Timestamp } from 'firebase/firestore';
import { ContactRequest } from '../types/database';

class ContactService {
  private contactsCollection = collection(db, 'contacts');

  async createContactRequest(data: Omit<ContactRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
    const contactRequest = {
      ...data,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(this.contactsCollection, contactRequest);
    return docRef.id;
  }

  async updateContactRequestStatus(id: string, status: 'accepted' | 'rejected'): Promise<void> {
    const contactRef = doc(this.contactsCollection, id);
    await updateDoc(contactRef, {
      status,
      updatedAt: Timestamp.now()
    });
  }

  async getReceivedRequests(userId: string): Promise<ContactRequest[]> {
    const q = query(this.contactsCollection, where('receiverId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as ContactRequest[];
  }

  async getSentRequests(userId: string): Promise<ContactRequest[]> {
    const q = query(this.contactsCollection, where('senderId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as ContactRequest[];
  }

  async checkExistingRequest(senderId: string, receiverId: string, exchangeRequestId: string): Promise<boolean> {
    const q = query(
      this.contactsCollection,
      where('senderId', '==', senderId),
      where('receiverId', '==', receiverId),
      where('exchangeRequestId', '==', exchangeRequestId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }
}

export const contactService = new ContactService(); 