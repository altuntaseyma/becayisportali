'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Notification, notificationService } from '@/services/notificationService';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  SwapHoriz as SwapHorizIcon,
  Info as InfoIcon
} from '@mui/icons-material';

export default function NotificationCenter() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (user) {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newNotifications: Notification[] = [];
        snapshot.forEach((doc) => {
          newNotifications.push({ id: doc.id, ...doc.data() } as Notification);
        });
        setNotifications(newNotifications);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      const notificationRef = doc(db, 'notifications', notification.id!);
      await updateDoc(notificationRef, { read: true });
    }

    handleClose();

    if (notification.type === 'match' && notification.data?.matchId) {
      router.push(`/matches`);
    } else if (notification.type === 'message' && notification.data?.matchId) {
      router.push(`/chat/${notification.data.matchId}`);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'match':
        return <SwapHorizIcon />;
      case 'message':
        return <MessageIcon />;
      case 'system':
        return <InfoIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 360, maxHeight: 480 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Bildirimler</Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="Bildirim bulunmuyor" />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItem
                key={notification.id}
                component="div"
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  backgroundColor: notification.read ? 'inherit' : 'action.hover',
                  cursor: 'pointer'
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.createdAt.toDate().toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Menu>
    </>
  );
} 