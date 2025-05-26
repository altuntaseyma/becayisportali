import { Timestamp } from 'firebase/firestore';

export interface MatchScore {
  locationScore: number;
  institutionScore: number;
  positionScore: number;
  totalScore: number;
}

export enum MatchStatus {
  PENDING = 'Beklemede',
  ACCEPTED = 'Kabul Edildi',
  REJECTED = 'Reddedildi',
  COMPLETED = 'Tamamlandı'
}

export interface MatchPair {
  id?: string;
  user1Id: string;
  user2Id: string;
  user1Name: string;
  user2Name: string;
  user1Institution: string;
  user2Institution: string;
  user1Position: string;
  user2Position: string;
  user1CurrentCity: string;
  user2CurrentCity: string;
  user1DesiredCity: string;
  user2DesiredCity: string;
  status: MatchStatus;
  score: MatchScore;
  createdAt: Timestamp;
  updatedAt: Timestamp;
} 