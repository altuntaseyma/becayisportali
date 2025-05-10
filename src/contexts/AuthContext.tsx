import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { userService } from '../services/firebase/userService';
import { User } from '../types/user';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  currentUserData: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Oturum kalıcılığını ayarla
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Oturum kalıcılığı ayarlanırken hata:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        setError(null);
        setCurrentUser(user);
        
        if (user) {
          try {
            const userData = await userService.getUser(user.uid);
            setCurrentUserData(userData);
          } catch (error) {
            console.error('Kullanıcı verisi alınırken hata:', error);
            setError('Kullanıcı bilgileri yüklenirken bir hata oluştu');
          }
        } else {
          setCurrentUserData(null);
        }
      } catch (error) {
        console.error('Auth state değişikliği hatası:', error);
        setError('Oturum durumu kontrol edilirken bir hata oluştu');
        setCurrentUserData(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function register(email: string, password: string, userData: Partial<User>) {
    try {
      setError(null);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await userService.createUser(user.uid, userData);
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      setError(error.message || 'Kayıt işlemi sırasında bir hata oluştu');
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Giriş hatası:', error);
      setError(error.message || 'Giriş yapılırken bir hata oluştu');
      throw error;
    }
  }

  async function logout() {
    try {
      setError(null);
      await signOut(auth);
    } catch (error: any) {
      console.error('Çıkış hatası:', error);
      setError(error.message || 'Çıkış yapılırken bir hata oluştu');
      throw error;
    }
  }

  const value = {
    currentUser,
    currentUserData,
    login,
    register,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 