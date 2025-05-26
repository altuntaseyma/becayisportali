import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'message' | 'system';
  read: boolean;
  createdAt: Timestamp;
  data?: {
    matchId?: string;
    senderId?: string;
  };
}

export const notificationService = {
  // Yeni bildirim oluştur
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Bildirim oluşturulurken hata:', error);
      throw error;
    }
  },

  // Eşleşme bildirimi oluştur
  async createMatchNotification(userId: string, matchId: string, otherUserName: string): Promise<void> {
    await this.createNotification({
      userId,
      title: 'Yeni Eşleşme!',
      message: `${otherUserName} ile eşleştiniz. Eşleşmeyi kabul etmek için tıklayın.`,
      type: 'match',
      read: false,
      data: { matchId }
    });
  },

  // Mesaj bildirimi oluştur
  async createMessageNotification(userId: string, matchId: string, senderName: string): Promise<void> {
    await this.createNotification({
      userId,
      title: 'Yeni Mesaj',
      message: `${senderName} size yeni bir mesaj gönderdi.`,
      type: 'message',
      read: false,
      data: { matchId, senderId: userId }
    });
  }
}; 