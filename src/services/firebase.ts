import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, inMemoryPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_PROJECT_ID 
    ? `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseio.com`
    : undefined
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Auth servisini başlat
const auth = getAuth(app);

// Firestore servisini başlat
let db;
try {
  db = getFirestore(app);
} catch (error) {
  console.error('Firestore başlatma hatası:', error);
  db = null;
}

// Realtime Database servisini başlat
let database;
try {
  database = getDatabase(app);
} catch (error) {
  console.error('Realtime Database başlatma hatası:', error);
  database = null;
}

// Geliştirme ortamında emülatörleri kullan
if (import.meta.env.DEV) {
  try {
    // Auth emülatörünü bağla
    if (auth) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      console.log('✅ Auth Emulator bağlandı: http://localhost:9099');
      
      // Oturum yönetimini hafızada tut
      setPersistence(auth, inMemoryPersistence)
        .then(() => console.log('✅ Auth persistence ayarlandı'))
        .catch(error => console.error('❌ Auth persistence hatası:', error));
    }
    
    // Firestore emülatörünü bağla
    if (db) {
      connectFirestoreEmulator(db, 'localhost', 8082);
      console.log('✅ Firestore Emulator bağlandı: http://localhost:8082');
    }

    // Realtime Database emülatörünü bağla
    if (database) {
      connectDatabaseEmulator(database, 'localhost', 9000);
      console.log('✅ Realtime Database Emulator bağlandı: http://localhost:9000');
    }
  } catch (error) {
    console.error('❌ Firebase emülatör bağlantı hatası:', error);
    console.warn('⚠️ Emülatör bağlantısı başarısız oldu, production modunda devam ediliyor');
  }
}

export { auth, db, database };
export default app; 