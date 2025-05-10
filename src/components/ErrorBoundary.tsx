import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Hata yakalandı:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Bir Hata Oluştu
              </h2>
              <p className="text-gray-600 mb-4">
                Üzgünüz, bir şeyler yanlış gitti. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 