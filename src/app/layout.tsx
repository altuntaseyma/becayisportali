'use client';

import { Inter } from 'next/font/google';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import NotificationCenter from '@/components/NotificationCenter';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <html lang="tr">
      <body className={inter.className}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Becayiş Portalı
            </Typography>
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <NotificationCenter />
                <Button color="inherit" component={Link} href="/becayis/create">
                  Becayiş İsteği Oluştur
                </Button>
                <Button color="inherit" component={Link} href="/matches">
                  Eşleşmelerim
                </Button>
                <Button color="inherit" component={Link} href="/profile">
                  Profilim
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button color="inherit" component={Link} href="/login">
                  Giriş Yap
                </Button>
                <Button color="inherit" component={Link} href="/register">
                  Kayıt Ol
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {children}
        </Container>
      </body>
    </html>
  );
} 