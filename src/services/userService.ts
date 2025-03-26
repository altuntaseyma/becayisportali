import { db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, Timestamp } from 'firebase/firestore';
import { User } from '../types/database';

const USERS_COLLECTION = 'users';

export const userService = {
  async createUser(userId: string, userData: Partial<User>): Promise<void> {
    const user = {
      id: userId,
      name: userData.name || '',
      email: userData.email || '',
      department: userData.department || '',
      institution: userData.institution || '',
      location: userData.location || { il: '', ilce: '' },
      photoURL: userData.photoURL || null,
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate()
    } as User;

    // undefined değerleri temizle
    Object.keys(user).forEach(key => {
      if (user[key as keyof User] === undefined) {
        user[key as keyof User] = null;
      }
    });

    const userForFirestore = {
      ...user,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    await setDoc(doc(db, USERS_COLLECTION, userId), userForFirestore);
  },

  async getUser(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (!userDoc.exists()) return null;

    const data = userDoc.data();
    return {
      ...data,
      id: userDoc.id,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as User;
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    const updateData = {
      ...userData,
      updatedAt: Timestamp.now()
    };

    // undefined değerleri temizle
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    await updateDoc(doc(db, USERS_COLLECTION, userId), updateData);
  },

  async updateUserLocation(userId: string, locationString: string): Promise<void> {
    try {
      if (!locationString || !locationString.includes(',')) {
        throw new Error('Geçersiz konum formatı');
      }

      const parts = locationString.split(',');
      if (parts.length !== 2) {
        throw new Error('Geçersiz konum formatı');
      }

      const [il, ilce] = parts.map(str => str.trim()).filter(str => str.length > 0);
      
      if (!il || !ilce) {
        throw new Error('Geçersiz il veya ilçe');
      }

      await this.updateUser(userId, {
        location: {
          il,
          ilce
        }
      });
    } catch (error) {
      console.error('Error updating user location:', error);
      throw error;
    }
  },

  async migrateUserLocations(): Promise<void> {
    try {
      const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
      const updatePromises: Promise<void>[] = [];

      querySnapshot.docs.forEach((doc) => {
        const userData = doc.data();
        if (userData && typeof userData.location === 'string' && userData.location.includes(',')) {
          updatePromises.push(this.updateUserLocation(doc.id, userData.location));
        }
      });

      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }
    } catch (error) {
      console.error('Error migrating user locations:', error);
      throw error;
    }
  }
}; 