import React, { useEffect, useState } from 'react';
import { NewsItem, categories, fetchMemurNews } from '../services/newsService';
import { Card, CardContent, Typography, Grid, Container, Tabs, Tab, Box } from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Genel Memur Haberleri');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const newsData = await fetchMemurNews();
      setNews(newsData);
      setLoading(false);
    };
    loadNews();
  }, []);

  const filteredNews = news.filter(item => item.category === selectedCategory);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Memur Haberleri
      </Typography>

      <Tabs
        value={selectedCategory}
        onChange={(_, newValue) => setSelectedCategory(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 4 }}
      >
        {categories.map((category) => (
          <Tab key={category} label={category} value={category} />
        ))}
      </Tabs>

      {loading ? (
        <Typography align="center">Yükleniyor...</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredNews.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {item.imageUrl && (
                  <Box
                    component="img"
                    src={item.imageUrl}
                    alt={item.title}
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(item.date), 'd MMMM yyyy', { locale: tr })} - {item.source}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default NewsPage; 