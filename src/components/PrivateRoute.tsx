import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { verificationService } from '../services/verificationService';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiresVerification?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiresVerification = false }) => {
  const { currentUser, loading, error } = useAuth();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkVerification = async () => {
      if (currentUser && requiresVerification) {
        try {
          const status = await verificationService.getVerificationStatus(currentUser.uid);
          if (isMounted) {
            setIsVerified(status.isVerified);
          }
        } catch (error) {
          console.error('Doğrulama durumu kontrol edilirken hata:', error);
          if (isMounted) {
            setIsVerified(false);
          }
        }
      }
      if (isMounted) {
        setVerificationLoading(false);
      }
    };

    checkVerification();

    return () => {
      isMounted = false;
    };
  }, [currentUser, requiresVerification]);

  if (loading || (requiresVerification && verificationLoading)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Bir Hata Oluştu
              </h2>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiresVerification && !isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Kimlik Doğrulama Gerekli
              </h2>
              <p className="text-gray-600 mb-6">
                Bu sayfaya erişmek için kimlik doğrulaması yapmanız gerekmektedir.
              </p>
              <button
                onClick={() => window.location.href = '/profile'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Profil Sayfasına Git
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute; 