import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, inMemoryPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Servisleri başlat
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Geliştirme ortamında emülatörleri kullan
if (import.meta.env.DEV) {
  try {
    // Auth emülatörünü bağla
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('✅ Auth Emulator bağlandı: http://localhost:9099');
    
    // Oturum yönetimini hafızada tut
    setPersistence(auth, inMemoryPersistence)
      .then(() => console.log('✅ Auth persistence ayarlandı'))
      .catch(error => console.error('❌ Auth persistence hatası:', error));
    
    // Firestore emülatörünü bağla
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('✅ Firestore Emulator bağlandı: http://localhost:8080');
    
    // Storage emülatörünü bağla
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('✅ Storage Emulator bağlandı: http://localhost:9199');
  } catch (error) {
    console.error('❌ Firebase emülatör bağlantı hatası:', error);
    console.warn('⚠️ Emülatör bağlantısı başarısız oldu, production modunda devam ediliyor');
  }
}

export default app; 