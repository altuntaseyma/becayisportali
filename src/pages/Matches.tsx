import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MatchingService } from '../services/MatchingService';
import { MatchPair, MatchPreference } from '../types/matching';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import MatchDetailModal from '../components/MatchDetailModal';

const matchingService = new MatchingService();

const Matches = () => {
  const { currentUser, currentUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState<MatchPair[]>([]);
  const [userPreference, setUserPreference] = useState<MatchPreference | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchPair | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || !currentUserData) return;
      setLoading(true);
      try {
        // 1. Kullanıcıya ait MatchPreference oluştur
        const userPreference = {
          userId: currentUser.uid,
          currentLocation: {
            city: currentUserData.currentLocation?.city || '',
            district: currentUserData.currentLocation?.district || ''
          },
          targetLocation: {
            city: (currentUserData.desiredLocations && currentUserData.desiredLocations[0]?.city) || '',
            district: (currentUserData.desiredLocations && currentUserData.desiredLocations[0]?.district) || ''
          },
          institutionType: currentUserData.institutionCategory || '',
          position: currentUserData.displayName || ''
        };
        // 2. Potansiyel eşleşmeleri bul ve kaydet
        await matchingService.findPotentialMatches(userPreference);
        // 3. Kullanıcının tüm eşleşmelerini getir
        const allMatches = await matchingService.getAllUserMatches(currentUser.uid);
        setMatches(allMatches);
      } catch (error) {
        console.error('Eşleşme verisi getirme hatası:', error);
        setError('Eşleşmeler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser, currentUserData]);

  const handleMatchAction = async (matchId: string, action: 'accept' | 'reject') => {
    try {
      const matchRef = doc(db, 'matches', matchId);
      await updateDoc(matchRef, {
        status: action === 'accept' ? 'accepted' : 'rejected',
        updatedAt: new Date()
      });

      // Eşleşmeleri güncelle
      setMatches(matches.map(match => 
        match.id === matchId 
          ? { ...match, status: action === 'accept' ? 'accepted' : 'rejected' }
          : match
      ));

      setIsModalOpen(false);
    } catch (error) {
      console.error('Eşleşme güncelleme hatası:', error);
      setError('Eşleşme durumu güncellenirken bir hata oluştu');
    }
  };

  const renderMatchScore = (score: number) => {
    const percentage = Math.round(score * 100);
    const getColor = () => {
      if (percentage >= 90) return 'bg-green-500';
      if (percentage >= 70) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="relative w-full h-2 bg-gray-200 rounded">
        <div
          className={`absolute left-0 top-0 h-full rounded ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
        <span className="absolute -top-5 right-0 text-xs font-medium">
          {percentage}%
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Potansiyel Eşleşmeler</h2>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XMarkIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eşleşme Skoru
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Konum Uyumu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kurum Uyumu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pozisyon Uyumu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {matches.length > 0 ? (
                    matches.map((match, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-32">
                            {renderMatchScore(match.score.totalScore)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-24">
                            {renderMatchScore(match.score.locationScore)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-24">
                            {renderMatchScore(match.score.institutionScore)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-24">
                            {renderMatchScore(match.score.positionScore)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              match.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {match.status === 'pending' ? 'Beklemede' :
                             match.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            onClick={() => {
                              setSelectedMatch(match);
                              setIsModalOpen(true);
                            }}
                          >
                            Detaylar
                          </button>
                          {match.status === 'pending' && (
                            <>
                              <button
                                className="text-green-600 hover:text-green-900 mr-4"
                                onClick={() => handleMatchAction(match.id, 'accept')}
                              >
                                Kabul Et
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleMatchAction(match.id, 'reject')}
                              >
                                Reddet
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        Henüz potansiyel eşleşme bulunmuyor
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMatch(null);
          }}
          onAccept={(matchId) => handleMatchAction(matchId, 'accept')}
          onReject={(matchId) => handleMatchAction(matchId, 'reject')}
        />
      )}
    </div>
  );
};

export default Matches; 