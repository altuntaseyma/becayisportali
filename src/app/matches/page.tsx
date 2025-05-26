'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { matchService } from '@/services/matchService';
import { MatchPair, MatchStatus } from '@/models/MatchPair';
import { Card, CardContent, Typography, Button, Grid, Box, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function MatchesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchPair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user]);

  const loadMatches = async () => {
    try {
      const userMatches = await matchService.getUserMatches(user!.uid);
      setMatches(userMatches);
    } catch (error) {
      console.error('Eşleşmeler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (matchId: string, status: MatchStatus) => {
    try {
      await matchService.updateMatchStatus(matchId, status);
      await loadMatches();
    } catch (error) {
      console.error('Eşleşme durumu güncellenirken hata oluştu:', error);
    }
  };

  const getStatusColor = (status: MatchStatus) => {
    switch (status) {
      case MatchStatus.PENDING:
        return 'warning';
      case MatchStatus.ACCEPTED:
        return 'success';
      case MatchStatus.REJECTED:
        return 'error';
      case MatchStatus.COMPLETED:
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <Typography>Yükleniyor...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Eşleşmelerim
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {matches.map((match) => (
          <Box key={match.id}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={match.status}
                    color={getStatusColor(match.status)}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {match.user1Id === user!.uid ? match.user2Name : match.user1Name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Kurum: {match.user1Id === user!.uid ? match.user2Institution : match.user1Institution}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Pozisyon: {match.user1Id === user!.uid ? match.user2Position : match.user1Position}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Mevcut Şehir: {match.user1Id === user!.uid ? match.user2CurrentCity : match.user1CurrentCity}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    İstenen Şehir: {match.user1Id === user!.uid ? match.user2DesiredCity : match.user1DesiredCity}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Eşleşme Skoru: {match.score.totalScore}
                  </Typography>
                </Box>
                {match.status === MatchStatus.PENDING && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleStatusUpdate(match.id!, MatchStatus.ACCEPTED)}
                    >
                      Kabul Et
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleStatusUpdate(match.id!, MatchStatus.REJECTED)}
                    >
                      Reddet
                    </Button>
                  </Box>
                )}
                {match.status === MatchStatus.ACCEPTED && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push(`/chat/${match.id}`)}
                  >
                    Mesaj Gönder
                  </Button>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
        {matches.length === 0 && (
          <Box>
            <Typography>Henüz eşleşmeniz bulunmamaktadır.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
} 