import { db } from '../config/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { User } from '../types/database';

class UserService {
  private collection = 'users';

  async createUser(userId: string, data: Partial<User>): Promise<void> {
    try {
      // undefined değerleri temizle
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );

      const userRef = doc(db, this.collection, userId);
      const userDataToSave = {
        ...cleanedData,
        phoneVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('Firestore\'a kaydedilecek veri:', userDataToSave);

      await setDoc(userRef, userDataToSave);

      // Kayıt sonrası kontrol
      const savedDoc = await getDoc(userRef);
      if (!savedDoc.exists()) {
        throw new Error('Document was not created successfully');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, this.collection, userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return null;
      }

      const data = userSnap.data() || {};
      return {
        id: userSnap.id,
        fullName: data.fullName || '',
        email: data.email || '',
        institution: data.institution || '',
        department: data.department || '',
        title: data.title || '',
        location: data.location || { il: '', ilce: '' },
        isVerified: data.isVerified ?? false,
        verificationStatus: data.verificationStatus || 'not_submitted',
        verificationDate: data.verificationDate ? (data.verificationDate.toDate ? data.verificationDate.toDate() : data.verificationDate) : undefined,
        idCardFront: data.idCardFront,
        idCardBack: data.idCardBack,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt || new Date())
      };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, this.collection, userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async verifyPhone(userId: string, phoneNumber: string): Promise<void> {
    try {
      const userRef = doc(db, this.collection, userId);
      await updateDoc(userRef, {
        phoneNumber,
        phoneVerified: true,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error verifying phone:', error);
      throw error;
    }
  }

  async findPotentialMatches(user: User): Promise<User[]> {
    try {
      // Sadece aynı kurumda olanları bul
      const q = query(
        collection(db, this.collection),
        where('institution', '==', user.institution)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => {
          const data = doc.data() || {};
          return {
            id: doc.id,
            fullName: data.fullName || '',
            email: data.email || '',
            institution: data.institution || '',
            department: data.department || '',
            title: data.title || '',
            location: data.location || { il: '', ilce: '' },
            isVerified: data.isVerified ?? false,
            verificationStatus: data.verificationStatus || 'not_submitted',
            verificationDate: data.verificationDate ? (data.verificationDate.toDate ? data.verificationDate.toDate() : data.verificationDate) : undefined,
            idCardFront: data.idCardFront,
            idCardBack: data.idCardBack,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date()),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt || new Date())
          };
        })
        .filter(potentialMatch => potentialMatch.id !== user.id);
    } catch (error) {
      console.error('Error finding potential matches:', error);
      throw error;
    }
  }

  private isValidMatch(user1: User, user2: User): boolean {
    return user1.institution === user2.institution;
  }
}

export const userService = new UserService(); 