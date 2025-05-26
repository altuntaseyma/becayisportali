import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserIcon, CheckBadgeIcon, LockClosedIcon, BellIcon, InformationCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const menu = [
  { name: 'Profil Bilgileri', icon: <UserIcon className="h-6 w-6" />, to: '/profile/info' },
  { name: 'Kimlik Doğrulama', icon: <CheckBadgeIcon className="h-6 w-6" />, to: '/profile/verification' },
  { name: 'Şifre Değiştir', icon: <LockClosedIcon className="h-6 w-6" />, to: '/profile/password' },
  { name: 'Bildirim Ayarları', icon: <BellIcon className="h-6 w-6" />, to: '/profile/notifications' },
  { name: 'Uygulama Hakkında', icon: <InformationCircleIcon className="h-6 w-6" />, to: '/profile/about' },
];

const ProfileMenu = () => {
  const location = useLocation();

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6">
      <h2 className="text-2xl font-extrabold text-center mb-8 tracking-tight text-gray-900">Profil</h2>
      <ul className="space-y-2">
        {menu.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <li key={item.name}>
              <Link
                to={item.to}
                className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <span className={`mr-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                <span className="flex-1 font-medium text-lg">
                  {item.name}
                </span>
                <svg 
                  className={`h-5 w-5 transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-8">
        <Link
          to="/logout"
          className="flex items-center justify-center text-red-600 font-semibold py-3 rounded-xl hover:bg-red-50 transition text-lg border border-transparent hover:border-red-200"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />
          Çıkış Yap
        </Link>
      </div>
    </div>
  );
};

export default ProfileMenu; 