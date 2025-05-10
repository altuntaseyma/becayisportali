import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Container, Paper, Typography, Box, Chip, Stack, Button, Divider, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

const ForumDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const ref = doc(db, 'forum_posts', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setPost({
          ...data,
          id: snap.id,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        });
        setComments(data.comments || []);
        // Görüntülenme sayısını artır
        await updateDoc(ref, { views: increment(1) });
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser || !id) return;
    setCommentLoading(true);
    const ref = doc(db, 'forum_posts', id);
    // Giriş yapan kullanıcının adını çek
    const user = await userService.getUser(currentUser.uid);
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.uid,
      userName: user?.fullName || 'Kullanıcı',
      content: commentText,
      createdAt: new Date().toISOString(),
    };
    await updateDoc(ref, {
      comments: arrayUnion(newComment)
    });
    setComments([...comments, newComment]);
    setCommentText('');
    setCommentLoading(false);
  };

  if (loading) return <Container sx={{ py: 6 }}><Typography>Yükleniyor...</Typography></Container>;
  if (!post) return <Container sx={{ py: 6 }}><Typography>Gönderi bulunamadı.</Typography></Container>;

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Geri
      </Button>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>{post.title}</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Chip label={post.category} color="primary" sx={{ fontWeight: 500, borderRadius: 2 }} />
          <Typography variant="body2" color="text.secondary">{post.userName}</Typography>
          <Typography variant="body2" color="text.secondary">{format(post.createdAt, 'd MMMM yyyy', { locale: tr })}</Typography>
        </Stack>
        <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>{post.content}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityIcon fontSize="small" sx={{ color: '#90a4ae' }} />
            <Typography variant="body2" color="text.secondary">{post.views}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThumbUpIcon fontSize="small" sx={{ color: '#90a4ae' }} />
            <Typography variant="body2" color="text.secondary">{post.likes}</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Yorumlar</Typography>
        <List sx={{ mb: 2 }}>
          {comments.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
              Henüz yorum yok. İlk yorumu sen yaz!
            </Typography>
          )}
          {comments.map((comment) => (
            <ListItem alignItems="flex-start" key={comment.id} sx={{ mb: 1 }}>
              <ListItemAvatar>
                <Avatar>{comment.userName.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography fontWeight={600} component="span">{comment.userName}</Typography>}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {comment.content}
                    </Typography>
                    <br />
                    <Typography component="span" variant="caption" color="text.secondary">
                      {format(new Date(comment.createdAt), 'd MMMM yyyy HH:mm', { locale: tr })}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
        {currentUser && (
          <form onSubmit={handleCommentSubmit}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                fullWidth
                size="small"
                disabled={commentLoading}
                sx={{ borderRadius: 2, background: '#f8fafd' }}
              />
              <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={!commentText.trim() || commentLoading}>
                Gönder
              </Button>
            </Stack>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ForumDetail; 