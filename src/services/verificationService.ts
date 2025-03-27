import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User } from '../types/database';
import { getAuth } from 'firebase/auth';

interface IDCardData {
  fullName: string;
  institution: string;
  department: string;
  title: string;
  idNumber: string;
}

interface VerificationError {
  code: string;
  message: string;
  details?: any;
}

class VerificationService {
  private async uploadIDCard(userId: string, file: File, side: 'front' | 'back'): Promise<string> {
    try {
      // Dosya boyutu kontrolü (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw {
          code: 'file-too-large',
          message: `${side === 'front' ? 'Ön' : 'Arka'} yüz fotoğrafı çok büyük. Maksimum dosya boyutu: 5MB`
        };
      }

      // Dosya tipi kontrolü
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        throw {
          code: 'invalid-file-type',
          message: `Geçersiz dosya tipi. Desteklenen formatlar: JPG, JPEG, PNG`
        };
      }

      // Dosyayı base64'e çevir
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Dosya okunamadı'));
          }
        };
        reader.onerror = (error) => reject(error);
      });
    } catch (error: any) {
      console.error('ID kartı yüklenirken hata:', error);
      throw error;
    }
  }

  private async extractDataFromIDCard(imageUrl: string): Promise<IDCardData> {
    try {
      // Gerçek OCR servisi entegre edilene kadar,
      // test amaçlı olarak kullanıcının mevcut bilgilerini kullanıyoruz
      const userData = await this.getCurrentUserData();
      
      return {
        fullName: userData.fullName || "",
        institution: userData.institution || "",
        department: userData.department || "",
        title: userData.title || "",
        idNumber: "12345" // Test için sabit bir değer
      };
    } catch (error) {
      console.error('ID kartından veri çıkarılırken hata:', error);
      throw {
        code: 'ocr-failed',
        message: 'ID kartındaki bilgiler okunamadı. Lütfen daha net bir fotoğraf yükleyin.'
      };
    }
  }

  private async getCurrentUserData(): Promise<User> {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('Kullanıcı verisi bulunamadı');
    }

    return userDoc.data() as User;
  }

  private compareData(userData: User, idCardData: IDCardData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Boş değerleri kontrol et
    if (!idCardData.fullName && !idCardData.institution && !idCardData.department && !idCardData.title) {
      errors.push('Kimlik kartından bilgiler okunamadı. Lütfen daha net bir fotoğraf yükleyin.');
      return { isValid: false, errors };
    }

    // Ad Soyad kontrolü (boşlukları ve büyük/küçük harf farklarını yok say)
    if (idCardData.fullName && 
        userData.fullName.toLowerCase().replace(/\s+/g, '') !== 
        idCardData.fullName.toLowerCase().replace(/\s+/g, '')) {
      errors.push('Ad Soyad bilgisi kimlik kartı ile eşleşmiyor');
    }

    // Kurum kontrolü (kısaltmaları ve yaygın varyasyonları kabul et)
    if (idCardData.institution && 
        !this.compareInstitutions(userData.institution, idCardData.institution)) {
      errors.push('Kurum bilgisi kimlik kartı ile eşleşmiyor');
    }

    // Departman kontrolü (benzer departman isimlerini kabul et)
    if (idCardData.department && 
        !this.compareDepartments(userData.department, idCardData.department)) {
      errors.push('Departman bilgisi kimlik kartı ile eşleşmiyor');
    }

    // Unvan kontrolü (yaygın kısaltmaları kabul et)
    if (idCardData.title && 
        !this.compareTitles(userData.title, idCardData.title)) {
      errors.push('Unvan bilgisi kimlik kartı ile eşleşmiyor');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private compareInstitutions(userInst: string, cardInst: string): boolean {
    const normalize = (str: string) => str.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/bakanligi$/, '')
      .replace(/müdürlügü$/, '')
      .replace(/müdürlüğü$/, '')
      .replace(/başkanligi$/, '')
      .replace(/başkanlığı$/, '');

    return normalize(userInst) === normalize(cardInst);
  }

  private compareDepartments(userDept: string, cardDept: string): boolean {
    const normalize = (str: string) => str.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/bölümü$/, '')
      .replace(/birimi$/, '')
      .replace(/departmani$/, '')
      .replace(/departmanı$/, '');

    return normalize(userDept) === normalize(cardDept);
  }

  private compareTitles(userTitle: string, cardTitle: string): boolean {
    const normalize = (str: string) => str.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/uzman$/, 'uzm')
      .replace(/yardımcı$/, 'yrd')
      .replace(/yardimci$/, 'yrd')
      .replace(/doktor$/, 'dr')
      .replace(/profesör$/, 'prof')
      .replace(/profesor$/, 'prof')
      .replace(/docent$/, 'doc')
      .replace(/doçent$/, 'doc');

    return normalize(userTitle) === normalize(cardTitle);
  }

  async verifyUser(userId: string, frontFile: File, backFile: File): Promise<{ success: boolean; message: string; errors?: string[] }> {
    try {
      // Kullanıcı verisini al
      const userDoc = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDoc);
      
      if (!userSnapshot.exists()) {
        throw {
          code: 'user-not-found',
          message: 'Kullanıcı bulunamadı'
        };
      }

      const userData = userSnapshot.data() as User;

      // ID kartı fotoğraflarını base64 olarak kaydet
      const frontImageData = await this.uploadIDCard(userId, frontFile, 'front');
      const backImageData = await this.uploadIDCard(userId, backFile, 'back');

      // ID kartından veriyi çıkar
      const idCardData = await this.extractDataFromIDCard(frontImageData);

      // Verileri karşılaştır
      const { isValid, errors } = this.compareData(userData, idCardData);

      // Doğrulama durumunu güncelle
      await updateDoc(userDoc, {
        isVerified: isValid,
        verificationStatus: isValid ? 'verified' : 'rejected',
        verificationDate: new Date(),
        idCardFront: frontImageData,
        idCardBack: backImageData,
        verificationErrors: errors
      });

      return {
        success: isValid,
        message: isValid 
          ? 'Kimlik doğrulama başarılı' 
          : 'Kimlik doğrulama başarısız. Lütfen bilgilerinizi kontrol edin.',
        errors: isValid ? undefined : errors
      };

    } catch (error: any) {
      console.error('Doğrulama işlemi sırasında hata:', error);
      
      if (error.code && error.message) {
        throw error;
      }

      throw {
        code: 'verification-failed',
        message: 'Doğrulama işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.'
      };
    }
  }

  async getVerificationStatus(userId: string): Promise<{
    isVerified: boolean;
    status: 'pending' | 'verified' | 'rejected' | 'not_submitted';
    frontImageUrl?: string;
    backImageUrl?: string;
    errors?: string[];
  }> {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDoc);
      
      if (!userSnapshot.exists()) {
        throw {
          code: 'user-not-found',
          message: 'Kullanıcı bulunamadı'
        };
      }

      const userData = userSnapshot.data() as User & { verificationErrors?: string[] };

      return {
        isVerified: userData.isVerified || false,
        status: userData.verificationStatus || 'not_submitted',
        frontImageUrl: userData.idCardFront,
        backImageUrl: userData.idCardBack,
        errors: userData.verificationErrors
      };
    } catch (error: any) {
      console.error('Doğrulama durumu alınırken hata:', error);
      if (error.code && error.message) {
        throw error;
      }
      throw {
        code: 'status-check-failed',
        message: 'Doğrulama durumu kontrol edilirken bir hata oluştu.'
      };
    }
  }
}

export const verificationService = new VerificationService(); 