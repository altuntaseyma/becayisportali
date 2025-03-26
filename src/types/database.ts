import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  name: string;
  location: {
    il: string;
    ilce: string;
  };
  institution: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExchangeRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  currentCity: string;
  currentDistrict: string;
  targetCity: string;
  targetDistrict: string;
  institution: string;
  department: string;
  notes: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  user1RequestId: string;
  user2RequestId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
} 