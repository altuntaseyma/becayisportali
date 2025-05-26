const { db } = require('../src/config/firebase');
const { collection, doc, setDoc } = require('firebase/firestore');
const { testUsers } = require('../src/testData');
const { MatchingService } = require('../src/services/MatchingService');

async function testMatching() {
  try {
    console.log('Test başlıyor...');

    // Test kullanıcılarını veritabanına ekle
    console.log('Test kullanıcıları ekleniyor...');
    for (const user of testUsers) {
      await setDoc(doc(db, 'users', user.id), user);
      console.log(`${user.displayName} eklendi`);
    }

    // MatchingService'i başlat
    const matchingService = new MatchingService();

    // Her kullanıcı için eşleşme testi yap
    console.log('\nEşleşme testleri başlıyor...');
    for (const user of testUsers) {
      console.log(`\n${user.displayName} için eşleşmeler aranıyor...`);
      
      const userPreference = {
        userId: user.id,
        currentLocation: user.currentLocation,
        targetLocation: user.desiredLocations[0],
        institutionType: user.institutionCategory,
        title: user.title
      };

      const matches = await matchingService.findPotentialMatches(userPreference);
      
      console.log(`Bulunan eşleşme sayısı: ${matches.length}`);
      matches.forEach(match => {
        console.log(`- Eşleşme: ${match.user1Id} <-> ${match.user2Id}`);
        console.log(`  Skor: ${Math.round(match.score.totalScore * 100)}%`);
        console.log(`  Durum: ${match.status}`);
      });
    }

    console.log('\nTest tamamlandı!');
  } catch (error) {
    console.error('Test sırasında hata oluştu:', error);
  }
}

testMatching();
module.exports = {}; 