'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { matchService } from '@/services/matchService';
import { MatchPair } from '@/models/MatchPair';
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { notificationService } from '@/services/notificationService';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  CircularProgress
} from '@mui/material';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Timestamp;
}

export default function ChatPage() {
  const { matchId } = useParams();
  const { user } = useAuth();
  const [match, setMatch] = useState<MatchPair | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && matchId) {
      loadMatch();
      subscribeToMessages();
    }
  }, [user, matchId]);

  const loadMatch = async () => {
    try {
      const userMatches = await matchService.getUserMatches(user!.uid);
      const currentMatch = userMatches.find(m => m.id === matchId);
      if (currentMatch) {
        setMatch(currentMatch);
      }
    } catch (error) {
      console.error('Eşleşme yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const messagesRef = collection(db, 'matches', matchId as string, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const newMessages: Message[] = [];
      snapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(newMessages);
      scrollToBottom();
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !match) return;

    try {
      const messagesRef = collection(db, 'matches', matchId as string, 'messages');
      await addDoc(messagesRef, {
        senderId: user.uid,
        senderName: user.displayName || 'İsimsiz Kullanıcı',
        content: newMessage.trim(),
        timestamp: Timestamp.now()
      });

      // Diğer kullanıcıya bildirim gönder
      const otherUserId = match.user1Id === user.uid ? match.user2Id : match.user1Id;
      await notificationService.createMessageNotification(
        otherUserId,
        matchId as string,
        user.displayName || 'İsimsiz Kullanıcı'
      );

      setNewMessage('');
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!match) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Eşleşme bulunamadı.</Typography>
      </Box>
    );
  }

  const otherUserName = match.user1Id === user!.uid ? match.user2Name : match.user1Name;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">{otherUserName} ile Mesajlaşma</Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.senderId === user!.uid ? 'flex-end' : 'flex-start',
              mb: 1
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: message.senderId === user!.uid ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1,
                maxWidth: '70%'
              }}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {message.senderName[0]}
              </Avatar>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: message.senderId === user!.uid ? 'primary.main' : 'grey.100',
                  color: message.senderId === user!.uid ? 'white' : 'text.primary',
                  borderRadius: 2
                }}
              >
                <Typography variant="body1">{message.content}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {message.timestamp.toDate().toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 1
        }}
      >
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
          variant="outlined"
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!newMessage.trim()}
        >
          Gönder
        </Button>
      </Box>
    </Box>
  );
} 