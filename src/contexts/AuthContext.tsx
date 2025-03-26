import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService } from '../services/userService';
import { User } from '../types/database';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  currentUserData: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

interface RegisterFormData {
  fullName: string;
  email: string;
  kurumKategorisi: string;
  kurumTuru: string;
  il: string;
  ilce: string;
  password: string;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        if (user) {
          const userData = await userService.getUser(user.uid);
          setCurrentUserData(userData);
        } else {
          setCurrentUserData(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  async function register(formData: RegisterFormData) {
    try {
      const { email, password, ...userData } = formData;
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await userService.createUser(user.uid, {
        name: userData.fullName,
        email: user.email || '',
        department: userData.kurumKategorisi,
        institution: userData.kurumTuru,
        location: {
          il: userData.il,
          ilce: userData.ilce
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  const value = {
    currentUser,
    currentUserData,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 