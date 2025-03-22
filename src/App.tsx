import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import CreateRequest from './pages/CreateRequest';
import Profile from './pages/Profile';
import Exchange from './pages/Exchange';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/create-request"
              element={
                <PrivateRoute>
                  <CreateRequest />
                </PrivateRoute>
              }
            />
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
                <PrivateRoute>
                  <Exchange />
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  {/* Messages component will be added later */}
                  <div>Messages Page</div>
                </PrivateRoute>
              }
            />
            <Route
              path="/request/:id"
              element={
                <PrivateRoute>
                  {/* RequestDetail component will be added later */}
                  <div>Request Detail Page</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
