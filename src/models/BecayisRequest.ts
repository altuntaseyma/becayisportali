import { Timestamp } from 'firebase/firestore';

export interface BecayisRequest {
  id?: string;
  userId: string;
  userName: string;
  institution: string;
  position: string;
  currentCity: string;
  desiredCity: string;
  note?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
} 