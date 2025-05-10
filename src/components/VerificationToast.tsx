import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const VerificationToast = () => {
  const { currentUserData } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (currentUserData?.isVerified) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentUserData?.isVerified]);

  if (!show || !currentUserData?.isVerified) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out z-50">
      <div className="flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Kimlik Doğrulaması Tamamlandı</span>
      </div>
    </div>
  );
};

export default VerificationToast; 