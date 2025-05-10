import React, { useState, useEffect, FormEvent } from 'react';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Link as RouterLink } from 'react-router-dom';

const categories = [
  'Genel',
  'Becayiş',
  'İzinler',
  'Maaş ve Ödemeler',
  'Kariyer',
  'Diğer'
];

interface ForumPost {
  id: string;
  title: string;
  content: string;
  userId: string;
  userName: string;
  category: string;
  views: number;
  likes: number;
  createdAt: Date;
}

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: categories[0] });
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, 'forum_posts'), orderBy('views', 'desc'));
      const querySnapshot = await getDocs(q);
      let postsData: ForumPost[] = [];
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const user = await userService.getUser(data.userId);
        postsData.push({
          id: docSnap.id,
          title: data.title || '',
          content: data.content || '',
          userId: data.userId,
          userName: user?.fullName || 'Anonim Kullanıcı',
          category: data.category || categories[0],
          views: data.views || 0,
          likes: data.likes || 0,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        });
      }
      // Eğer hiç gönderi yoksa demo gönderileri ekle
      if (postsData.length === 0) {
        const demoPosts = [
          {
            title: 'Becayiş Hakkında Soru',
            content: 'Becayiş işlemleri nasıl ilerliyor, tecrübesi olan var mı?',
            category: 'Becayiş',
          },
          {
            title: 'İzin Hakları',
            content: 'Yıllık izin hakkı kaç gün, resmi kaynak paylaşabilir misiniz?',
            category: 'İzinler',
          },
          {
            title: 'Maaş Bordrosu',
            content: 'E-Devlet maaş bordrosu görüntüleme adımları nelerdir?',
            category: 'Maaş ve Ödemeler',
          },
          {
            title: 'Kariyer Planı',
            content: 'Kariyer basamakları ve sınavlar hakkında bilgi almak istiyorum.',
            category: 'Kariyer',
          },
        ];
        for (const post of demoPosts) {
          await addDoc(collection(db, 'forum_posts'), {
            ...post,
            userId: 'demo',
            userName: 'Demo Kullanıcı',
            views: Math.floor(Math.random()*100),
            likes: Math.floor(Math.random()*20),
            createdAt: serverTimestamp(),
          });
        }
        // Demo gönderiler eklendikten sonra tekrar fetch et
        const q2 = query(collection(db, 'forum_posts'), orderBy('views', 'desc'));
        const querySnapshot2 = await getDocs(q2);
        postsData = [];
        for (const docSnap of querySnapshot2.docs) {
          const data = docSnap.data();
          postsData.push({
            id: docSnap.id,
            title: data.title || '',
            content: data.content || '',
            userId: data.userId,
            userName: data.userName || 'Demo Kullanıcı',
            category: data.category || categories[0],
            views: data.views || 0,
            likes: data.likes || 0,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          });
        }
      }
      setPosts(postsData);
    };
    const fetchUserName = async () => {
      if (currentUser) {
        const user = await userService.getUser(currentUser.uid);
        setUserName(user?.fullName || '');
      }
    };
    fetchPosts();
    fetchUserName();
  }, [currentUser]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !currentUser) return;
    try {
      await addDoc(collection(db, 'forum_posts'), {
        title: newPost.title,
        content: newPost.content,
        userId: currentUser.uid,
        category: newPost.category,
        views: 0,
        likes: 0,
        createdAt: serverTimestamp(),
      });
      setOpen(false);
      setNewPost({ title: '', content: '', category: categories[0] });
      // Yeniden yükle
      const q = query(collection(db, 'forum_posts'), orderBy('views', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData: ForumPost[] = [];
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const user = await userService.getUser(data.userId);
        postsData.push({
          id: docSnap.id,
          title: data.title || '',
          content: data.content || '',
          userId: data.userId,
          userName: user?.fullName || 'Anonim Kullanıcı',
          category: data.category || categories[0],
          views: data.views || 0,
          likes: data.likes || 0,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        });
      }
      setPosts(postsData);
    } catch (error) {
      console.error('Gönderi eklenemedi:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight={600}>Forum</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen} sx={{ borderRadius: 3, fontWeight: 600 }}>
          Yeni Gönderi
        </Button>
      </Box>
      <Paper elevation={2} sx={{ p: 2, mb: 3, background: '#f8fafd', borderRadius: 4 }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              color={selectedCategory === cat ? 'primary' : 'default'}
              onClick={() => setSelectedCategory(cat)}
              sx={{ fontWeight: 500, fontSize: 16, px: 2, py: 1, borderRadius: 3 }}
            />
          ))}
        </Stack>
      </Paper>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1, mt: 2 }}>Çok Okunanlar</Typography>
      <Paper elevation={1} sx={{ borderRadius: 4 }}>
        <List>
          {posts.filter(p => selectedCategory === 'Genel' || p.category === selectedCategory).slice(0, 10).map((post) => (
            <React.Fragment key={post.id}>
              <ListItem alignItems="flex-start" component={RouterLink} to={`/forum/${post.id}`}
                sx={{ '&:hover': { background: '#f0f4fa' }, borderRadius: 3, my: 1 }}>
                <ListItemText
                  primary={<Typography fontWeight={600} fontSize={17} component="div">{post.title}</Typography>}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }} component="div">
                      <Chip size="small" label={post.category} sx={{ fontWeight: 500, borderRadius: 2 }} />
                      <Typography variant="body2" color="text.secondary" component="span">{post.userName}</Typography>
                      <Typography variant="body2" color="text.secondary" component="span">{format(post.createdAt, 'd MMMM yyyy', { locale: tr })}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} component="span">
                        <VisibilityIcon fontSize="small" sx={{ color: '#90a4ae' }} />
                        <Typography variant="body2" color="text.secondary" component="span">{post.views}</Typography>
                        <ThumbUpIcon fontSize="small" sx={{ color: '#90a4ae', ml: 1 }} />
                        <Typography variant="body2" color="text.secondary" component="span">{post.likes}</Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Forum Gönderisi Oluştur</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Başlık"
              name="title"
              value={newPost.title}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Kategori"
              name="category"
              value={newPost.category}
              onChange={handleChange}
              select
              fullWidth
              required
              sx={{ mb: 2 }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="İçerik"
              name="content"
              value={newPost.content}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={4}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>İptal</Button>
            <Button type="submit" variant="contained">Gönder</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Forum; 