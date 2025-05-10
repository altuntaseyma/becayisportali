import React, { useEffect, useState } from 'react';
import { NewsItem, categories, fetchMemurNews } from '../services/newsService';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const categoryImages: Record<string, string> = {
  'Memur Maaşları': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'Memur Atamaları': 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  'Memur Hakları': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  'Memur Sınavları': 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80',
  'Memur Emeklilik': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'Memur Sendikaları': 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
  'Genel Memur Haberleri': 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
};

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const newsData = await fetchMemurNews();
      setNews(newsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setLoading(false);
    };
    loadNews();
  }, []);

  const filteredNews = selectedCategory === 'Tümü'
    ? news
    : news.filter(item => item.category === selectedCategory);

  return (
    <Box sx={{ minHeight: '100vh', background: alpha(theme.palette.primary.main, 0.03), py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 3 }}>
            Memur Haberleri
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            {/* Sidebar */}
            <Box sx={{ minWidth: 220, maxWidth: 240 }}>
              <List component="nav" sx={{ background: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, p: 0 }}>
                <ListItemButton
                  selected={selectedCategory === 'Tümü'}
                  onClick={() => setSelectedCategory('Tümü')}
                >
                  <ListItemText primary="Tüm Haberler" primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
                <Divider />
                {categories.map((category) => (
                  <ListItemButton
                    key={category}
                    selected={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <ListItemText primary={category} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
            {/* Grid */}
            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Haberler Yükleniyor...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {filteredNews.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                      <Card
                        sx={{
                          height: 320,
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                          borderRadius: 3,
                          overflow: 'hidden',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                          transition: 'transform 0.18s, box-shadow 0.18s',
                          '&:hover': {
                            transform: 'translateY(-4px) scale(1.03)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.13)'
                          }
                        }}
                        onClick={() => navigate(`/news/${item.id}`)}
                      >
                        <Box
                          component="img"
                          src={categoryImages[item.category] || item.imageUrl || categoryImages['Genel Memur Haberleri']}
                          alt={item.title}
                          sx={{ width: '100%', height: 140, objectFit: 'cover' }}
                        />
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                            {item.category}
                          </Typography>
                          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 1, lineHeight: 1.3 }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {format(new Date(item.date), 'd MMMM yyyy', { locale: tr })} - {item.source}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default News; 