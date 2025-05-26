'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { matchService } from '@/services/matchService';
import { BecayisRequest } from '@/models/BecayisRequest';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import { iller, ilceler } from '@/data/turkiyeData';

export default function CreateBecayisRequest() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    institution: '',
    position: '',
    currentCity: '',
    desiredCity: '',
    note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('Kullanıcı girişi yapılmamış');
      }

      const becayisRequest: BecayisRequest = {
        userId: user.uid,
        userName: user.displayName || 'İsimsiz Kullanıcı',
        institution: formData.institution,
        position: formData.position,
        currentCity: formData.currentCity,
        desiredCity: formData.desiredCity,
        note: formData.note,
        status: 'active',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'becayisRequests'), becayisRequest);
      
      // Eşleşmeleri kontrol et
      await matchService.checkMatches({ ...becayisRequest, id: docRef.id });

      setSuccess(true);
      setTimeout(() => {
        router.push('/becayis/my-requests');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Becayiş İsteği Oluştur
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Kurum</InputLabel>
              <Select
                name="institution"
                value={formData.institution}
                onChange={(e) => handleChange(e as React.ChangeEvent<{ name?: string; value: unknown }>)}
                required
              >
                <MenuItem value="Sağlık Bakanlığı">Sağlık Bakanlığı</MenuItem>
                <MenuItem value="Üniversite">Üniversite</MenuItem>
                <MenuItem value="Özel Hastane">Özel Hastane</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Pozisyon</InputLabel>
              <Select
                name="position"
                value={formData.position}
                onChange={(e) => handleChange(e as React.ChangeEvent<{ name?: string; value: unknown }>)}
                required
              >
                <MenuItem value="Doktor">Doktor</MenuItem>
                <MenuItem value="Hemşire">Hemşire</MenuItem>
                <MenuItem value="Teknisyen">Teknisyen</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Mevcut Şehir</InputLabel>
              <Select
                name="currentCity"
                value={formData.currentCity}
                onChange={(e) => handleChange(e as React.ChangeEvent<{ name?: string; value: unknown }>)}
                required
              >
                {iller.map((il) => (
                  <MenuItem key={il} value={il}>
                    {il}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>İstenen Şehir</InputLabel>
              <Select
                name="desiredCity"
                value={formData.desiredCity}
                onChange={(e) => handleChange(e as React.ChangeEvent<{ name?: string; value: unknown }>)}
                required
              >
                {iller.map((il) => (
                  <MenuItem key={il} value={il}>
                    {il}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              name="note"
              label="Not"
              value={formData.note}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'İstek Oluşturuluyor...' : 'İstek Oluştur'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Becayiş isteği başarıyla oluşturuldu!
        </Alert>
      </Snackbar>
    </Box>
  );
} 