import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { User, UserLocation } from '../../types/user';

export const userService = {
  async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        // Timestamp verilerini güvenli bir şekilde işle
        const user: User = {
          id: userDoc.id,
          email: data.email,
          displayName: data.displayName,
          currentLocation: data.currentLocation,
          institution: data.institution,
          institutionCategory: data.institutionCategory,
          isVerified: data.isVerified ?? false,
          desiredLocations: data.desiredLocations || [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
        return user;
      }
      return null;
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      throw error;
    }
  },

  async createUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      console.log('Creating user with ID:', userId);
      console.log('User data:', userData);

      // Firestore referansını oluştur
      const userRef = doc(db, 'users', userId);

      // Firestore'a kaydedilecek veriyi hazırla
      const userDataToSave = {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isVerified: false,
        desiredLocations: userData.desiredLocations || [],
        id: userId // Kullanıcı ID'sini de ekleyelim
      };

      console.log('Final data to save:', userDataToSave);

      // Önce koleksiyonun var olup olmadığını kontrol et
      const usersCollection = collection(db, 'users');
      
      // Veriyi Firestore'a kaydet
      await setDoc(userRef, userDataToSave, { merge: true });
      
      // Kaydedilen veriyi doğrula
      const savedDoc = await getDoc(userRef);
      if (!savedDoc.exists()) {
        throw new Error('Document was not created successfully');
      }
      
      console.log('Saved document data:', savedDoc.data());
      console.log('Document exists in Firestore:', savedDoc.exists());
      console.log('Document path:', savedDoc.ref.path);
      
      console.log('User created successfully');
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
      console.error('Hata detayları:', {
        message: error instanceof Error ? error.message : 'Bilinmeyen hata',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Kullanıcı güncellenemedi:', error);
      throw error;
    }
  },

  async updateUserLocation(userId: string, location: UserLocation): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        currentLocation: location,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Kullanıcı konumu güncellenemedi:', error);
      throw error;
    }
  },

  async getUsersByLocation(location: UserLocation): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('currentLocation.city', '==', location.city),
        where('currentLocation.district', '==', location.district)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    } catch (error) {
      console.error('Konuma göre kullanıcılar alınamadı:', error);
      throw error;
    }
  },

  async getUsersByDesiredLocation(location: UserLocation): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('desiredLocations', 'array-contains', location)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    } catch (error) {
      console.error('İstenen konuma göre kullanıcılar alınamadı:', error);
      throw error;
    }
  }
}; 