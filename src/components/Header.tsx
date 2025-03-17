import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-900">Becayiş Platformu</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-900">
              Ana Sayfa
            </Link>
            <Link to="/becayis" className="text-gray-700 hover:text-blue-900">
              Becayiş
            </Link>
            <Link to="/forum" className="text-gray-700 hover:text-blue-900">
              Forum
            </Link>
            <Link to="/haberler" className="text-gray-700 hover:text-blue-900">
              Haberler
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="text-gray-700">{currentUser.email}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-900"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 