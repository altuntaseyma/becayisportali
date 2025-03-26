import { createTestUser } from '../src/testData.ts';

const main = async () => {
  try {
    const testUser = await createTestUser();
    console.log('Test kullanıcısı bilgileri:', testUser);
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
};

main(); 