import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  fullName: string;
  email: string;
  institution: string;
  department: string;
  title: string;
  location: {
    il: string;
    ilce: string;
  };
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'not_submitted';
  verificationDate?: Date;
  idCardFront?: string;
  idCardBack?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExchangeRequest {
  id: string;
  userId: string;
  currentCity: string;
  currentDistrict: string;
  targetCities: Array<{
    il: string;
    ilce: string;
    priority?: number;
  }>;
  institution: string;
  department: string;
  position: string;
  notes?: string;
  isActive: boolean;
  documents: Array<{
    type: string;
    url: string;
    name: string;
    uploadedAt: Date;
  }>;
  matches: Array<{
    requestId: string;
    status: 'pending' | 'accepted' | 'rejected';
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  exchangeRequestId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  comments: {
    id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface News {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'match' | 'message' | 'document' | 'system';
  relatedId?: string; // İlgili istek, mesaj veya belge ID'si
  read: boolean;
  createdAt: Date;
}

export interface ContactRequest {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  exchangeRequestId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
} 