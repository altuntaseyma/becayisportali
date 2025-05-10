import { Timestamp } from 'firebase/firestore';

export interface UserLocation {
  city: string;
  district: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  currentLocation: UserLocation;
  institution: string;
  institutionCategory: string;
  department: string;
  title: string;
  isVerified: boolean;
  desiredLocations: UserLocation[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  profilePhotoUrl?: string;
  fullName?: string;
  location?: {
    il: string;
    ilce: string;
  };
} 