import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import VerificationToast from './components/VerificationToast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Exchange from './pages/Exchange';
import ExchangeRequests from './pages/ExchangeRequests';
import ExchangeMatches from './pages/ExchangeMatches';
import ContactRequests from './pages/ContactRequests';
import Forum from './pages/Forum';
import News from './pages/News';
import Matches from './pages/Matches';
import ForumDetail from './pages/ForumDetail';
import NewsDetail from './pages/NewsDetail';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
              <Header />
              <VerificationToast />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/exchange"
                    element={
                      <PrivateRoute requiresVerification>
                        <Exchange />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/matches"
                    element={
                      <PrivateRoute requiresVerification>
                        <Matches />
                      </PrivateRoute>
                    }
                  />
                  <Route 
                    path="/exchange-requests" 
                    element={
                      <PrivateRoute requiresVerification>
                        <ExchangeRequests />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/contacts" 
                    element={
                      <PrivateRoute requiresVerification>
                        <ContactRequests />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/forum" 
                    element={
                      <PrivateRoute requiresVerification>
                        <Forum />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/news" 
                    element={
                      <PrivateRoute requiresVerification>
                        <News />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/news/:id" 
                    element={
                      <PrivateRoute requiresVerification>
                        <NewsDetail />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/forum/:id" 
                    element={
                      <PrivateRoute requiresVerification>
                        <ForumDetail />
                      </PrivateRoute>
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
