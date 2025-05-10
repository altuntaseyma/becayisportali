import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  fullScreen = false,
  text = 'Yükleniyor...'
}) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}
      />
      {text && (
        <p className="mt-4 text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner; 