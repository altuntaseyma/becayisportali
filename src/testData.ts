import { auth, db } from './config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export const createTestUser = async () => {
  try {
    // Test kullanıcı bilgileri
    const testUserEmail = 'test@becayis.gov.tr';
    const testUserPassword = 'Test123!';
    
    // Firebase Authentication'da kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, testUserEmail, testUserPassword);
    const userId = userCredential.user.uid;

    // Firestore'da kullanıcı verilerini oluştur
    const userData = {
      id: userId,
      name: 'Test Kullanıcı',
      email: testUserEmail,
      department: 'Bilgi İşlem',
      institution: 'Milli Eğitim Bakanlığı',
      location: {
        il: 'Ankara',
        ilce: 'Çankaya'
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    await setDoc(doc(db, 'users', userId), userData);

    console.log('Test kullanıcısı başarıyla oluşturuldu:', {
      email: testUserEmail,
      password: testUserPassword
    });

    return {
      email: testUserEmail,
      password: testUserPassword
    };
  } catch (error) {
    console.error('Test kullanıcısı oluşturulurken hata:', error);
    throw error;
  }
}; 