import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMemurNews, NewsItem } from '../services/newsService';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const categoryImages: Record<string, string> = {
  'Memur Maaşları': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'Memur Atamaları': 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
  'Memur Hakları': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
  'Memur Sınavları': 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80',
  'Memur Emeklilik': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
  'Memur Sendikaları': 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80',
  'Genel Memur Haberleri': 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80',
};

const NewsDetail: React.FC = () => {
  const { id } = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const allNews = await fetchMemurNews();
      const found = allNews.find(n => n.id === id);
      setNews(found || null);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return <Box sx={{ py: 8, textAlign: 'center' }}><Typography>Yükleniyor...</Typography></Box>;
  }
  if (!news) {
    return <Box sx={{ py: 8, textAlign: 'center' }}><Typography>Haber bulunamadı.</Typography></Box>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
        <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate(-1)}>
          &larr; Geri Dön
        </Button>
        <Box
          component="img"
          src={categoryImages[news.category] || news.imageUrl || categoryImages['Genel Memur Haberleri']}
          alt={news.title}
          sx={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 2, mb: 3 }}
        />
        <Typography variant="overline" color="primary" sx={{ fontWeight: 600 }}>
          {news.category}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, my: 2 }}>
          {news.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          {format(new Date(news.date), 'd MMMM yyyy', { locale: tr })} - {news.source}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.15rem', lineHeight: 1.7 }}>
          {news.content}
        </Typography>
      </Paper>
    </Container>
  );
};

export default NewsDetail; 