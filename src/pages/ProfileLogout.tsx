import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <div className="text-blue-700 font-bold text-lg mb-2">Çıkış yapılıyor...</div>
      <div className="text-gray-500">Lütfen bekleyin.</div>
    </div>
  );
};

export default ProfileLogout; 