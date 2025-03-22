export interface MatchScore {
  locationScore: number;
  institutionScore: number;
  positionScore: number;
  totalScore: number;
}

export interface MatchPair {
  id: string;
  user1Id: string;
  user2Id: string;
  score: MatchScore;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface MatchPreference {
  userId: string;
  currentLocation: {
    city: string;
    district: string;
  };
  targetLocation: {
    city: string;
    district: string;
  };
  institutionType: string;
  position: string;
  additionalPreferences?: {
    institutionSize?: 'small' | 'medium' | 'large';
    experienceLevel?: 'junior' | 'mid' | 'senior';
    workload?: 'light' | 'moderate' | 'heavy';
  };
} 