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
  getDocs
} from 'firebase/firestore';
import { User } from '../types/database';

class UserService {
  private collection = 'users';

  async createUser(userId: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, this.collection, userId);
      await setDoc(userRef, {
        ...data,
        phoneVerified: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
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

      return {
        id: userSnap.id,
        ...userSnap.data(),
        createdAt: userSnap.data().createdAt.toDate(),
        updatedAt: userSnap.data().updatedAt.toDate(),
        startDate: userSnap.data().startDate?.toDate()
      } as User;
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
      // Aynı kurum ve hizmet sınıfındaki kullanıcıları bul
      const q = query(
        collection(db, this.collection),
        where('institution', '==', user.institution),
        where('serviceClass', '==', user.serviceClass),
        where('position', '==', user.position)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
          startDate: doc.data().startDate?.toDate()
        }))
        .filter(potentialMatch => 
          potentialMatch.id !== user.id && // Kendisi hariç
          this.isValidMatch(user, potentialMatch as User)
        ) as User[];
    } catch (error) {
      console.error('Error finding potential matches:', error);
      throw error;
    }
  }

  private isValidMatch(user1: User, user2: User): boolean {
    // Sağlık Bakanlığı çalışanları için özel kontrol
    if (user1.institution === 'Sağlık Bakanlığı') {
      return user1.location.region === user2.location.region;
    }

    // Diğer kurumlar için genel kontrol
    return (
      user1.institution === user2.institution && // Aynı kurum
      user1.serviceClass === user2.serviceClass && // Aynı hizmet sınıfı
      user1.position === user2.position // Aynı pozisyon
    );
  }
}

export const userService = new UserService(); 