import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Exchange from './pages/Exchange';
import Matches from './pages/Matches';
import Home from './pages/Home';
import Forum from './pages/Forum';
import News from './pages/News';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/exchange" element={
              <PrivateRoute>
                <Exchange />
              </PrivateRoute>
            } />
            <Route path="/matches" element={
              <PrivateRoute>
                <Matches />
              </PrivateRoute>
            } />
            <Route path="/forum" element={<Forum />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
