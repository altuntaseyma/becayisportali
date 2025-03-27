import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { verificationService } from '../services/verificationService';
import {
  UserGroupIcon,
  NewspaperIcon,
  UserIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const { currentUser } = useAuth();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      if (currentUser) {
        try {
          const status = await verificationService.getVerificationStatus(currentUser.uid);
          setIsVerified(status.isVerified);
        } catch (error) {
          console.error('Doğrulama durumu kontrol edilirken hata:', error);
          setIsVerified(false);
        }
      }
      setVerificationLoading(false);
    };

    checkVerification();
  }, [currentUser]);

  const features = [
    {
      name: 'Becayiş İstekleri',
      description: 'Mevcut becayiş isteklerini görüntüleyin ve yeni istek oluşturun',
      icon: ArrowPathIcon,
      href: '/exchange',
      requiresVerification: true
    },
    {
      name: 'Forum',
      description: 'Diğer memurlarla iletişime geçin, sorularınızı sorun',
      icon: ChatBubbleLeftRightIcon,
      href: '/forum',
      requiresVerification: true
    },
    {
      name: 'Memur Haberleri',
      description: 'Güncel memur haberlerini takip edin',
      icon: NewspaperIcon,
      href: '/news',
      requiresVerification: true
    },
    {
      name: 'Eşleşmeler',
      description: 'Size uygun becayiş eşleşmelerini görüntüleyin',
      icon: UserGroupIcon,
      href: '/matches',
      requiresVerification: true
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 h-full w-full" aria-hidden="true">
          <div className="relative h-full">
            <svg
              className="absolute right-full transform translate-y-1/3 translate-x-1/4 md:translate-y-1/2 sm:translate-x-1/2 lg:translate-x-full"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={784} fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)" />
            </svg>
            <svg
              className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="d2a68204-c383-44b1-b99f-42ccff4e5365"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={784} fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)" />
            </svg>
          </div>
        </div>

        <div className="relative pt-6 pb-16 sm:pb-24">
          <div className="px-4 mx-auto max-w-7xl sm:px-6">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Memur Becayiş</span>
                <span className="block text-blue-600">Platformu</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Türkiye'nin en büyük memur becayiş platformuna hoş geldiniz. Hayalinizdeki şehirde çalışmak için hemen becayiş isteği oluşturun.
              </p>

              {currentUser && !verificationLoading && !isVerified && (
                <div className="mt-6 max-w-md mx-auto">
                  <div className="rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Kimlik Doğrulaması Gerekli
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Platform özelliklerini kullanabilmek için kimlik doğrulaması yapmanız gerekmektedir.
                          </p>
                        </div>
                        <div className="mt-4">
                          <div className="-mx-2 -my-1.5 flex">
                            <Link
                              to="/profile"
                              className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                            >
                              Kimlik Doğrulamaya Git
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentUser && !verificationLoading && isVerified && (
                <div className="mt-6 max-w-md mx-auto">
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ShieldCheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Kimlik Doğrulaması Tamamlandı
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            Platformun tüm özelliklerini kullanabilirsiniz.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                {!currentUser ? (
                  <>
                    <div className="rounded-md shadow">
                      <Link
                        to="/register"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                      >
                        Üye Ol
                      </Link>
                    </div>
                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                      >
                        Giriş Yap
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="rounded-md shadow">
                    <Link
                      to={isVerified ? "/exchange" : "/profile"}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      {isVerified ? 'Becayiş İsteği Oluştur' : 'Kimlik Doğrulamaya Git'}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-base font-semibold uppercase tracking-wider text-blue-600">Özellikler</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Her şey tek platformda
          </p>
          <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
            Becayiş sürecinizi kolaylaştırmak için ihtiyacınız olan tüm araçlar
          </p>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className={`pt-6 ${
                    currentUser && feature.requiresVerification && !isVerified
                      ? 'opacity-50 cursor-not-allowed'
                      : 'transform hover:scale-105 transition-transform duration-200'
                  }`}
                >
                  <Link
                    to={currentUser && feature.requiresVerification && !isVerified ? '/profile' : feature.href}
                    className="block"
                  >
                    <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                      <div className="-mt-6">
                        <div>
                          <span className="inline-flex items-center justify-center rounded-md bg-blue-500 p-3 shadow-lg">
                            <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                          {feature.name}
                          {currentUser && feature.requiresVerification && !isVerified && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Doğrulama Gerekli
                            </span>
                          )}
                        </h3>
                        <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 