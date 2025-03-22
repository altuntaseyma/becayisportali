import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

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
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

// Development modunda emülatörlere bağlan
if (import.meta.env.DEV) {
  try {
    console.log('Firebase Emülatörlerine bağlanılıyor...');
    
    // Emülatörlere bağlan
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectDatabaseEmulator(database, '127.0.0.1', 9000);
    
    console.log('Tüm emülatör bağlantıları başarılı!');
  } catch (error) {
    console.error('Emülatör bağlantısında hata:', error);
  }
}

export { auth, db, database }; 