export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  currentInstitution: string;
  title: string;
  department: string;
  desiredLocations: string[];
  createdAt: Date;
}

export interface BecayisRequest {
  id: string;
  userId: string;
  currentInstitution: string;
  department: string;
  title: string;
  desiredLocations: string[];
  description: string;
  status: 'active' | 'pending' | 'matched' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  requesterId: string;
  responderId: string;
  requesterRequestId: string;
  responderRequestId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
} 