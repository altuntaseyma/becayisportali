import { db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Match } from '../types/database';

const MATCHES_COLLECTION = 'matches';

export const matchService = {
  async createMatch(request1Id: string, request2Id: string, user1Id: string, user2Id: string): Promise<string> {
    const matchRef = doc(collection(db, MATCHES_COLLECTION));
    const match: Match = {
      id: matchRef.id,
      request1Id,
      request2Id,
      user1Id,
      user2Id,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    await setDoc(matchRef, match);
    return match.id;
  },

  async getMatch(matchId: string): Promise<Match | null> {
    const matchDoc = await getDoc(doc(db, MATCHES_COLLECTION, matchId));
    return matchDoc.exists() ? matchDoc.data() as Match : null;
  },

  async updateMatchStatus(matchId: string, status: Match['status']): Promise<void> {
    const updateData = {
      status,
      updatedAt: Timestamp.now()
    };

    await updateDoc(doc(db, MATCHES_COLLECTION, matchId), updateData);
  },

  async getUserMatches(userId: string): Promise<Match[]> {
    const q = query(
      collection(db, MATCHES_COLLECTION),
      where('user1Id', '==', userId)
    );

    const q2 = query(
      collection(db, MATCHES_COLLECTION),
      where('user2Id', '==', userId)
    );

    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q),
      getDocs(q2)
    ]);

    const matches = [
      ...snapshot1.docs.map(doc => doc.data() as Match),
      ...snapshot2.docs.map(doc => doc.data() as Match)
    ];

    return matches;
  }
}; 