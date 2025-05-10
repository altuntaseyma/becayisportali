import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    error: <XCircleIcon className="h-6 w-6 text-red-500" />,
    warning: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />,
    info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 animate-slide-up`}>
      <div className={`flex items-center p-4 rounded-lg border ${backgrounds[type]} shadow-lg max-w-md`}>
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3 mr-8 text-sm font-medium text-gray-800">
          {message}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast; 