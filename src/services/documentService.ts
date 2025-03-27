import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

class DocumentService {
  private storage = storage;

  async uploadDocument(
    file: File,
    userId: string,
    exchangeRequestId: string,
    type: 'petition' | 'id' | 'photo' | 'other'
  ): Promise<{ url: string; name: string }> {
    try {
      // Dosya uzantısını al
      const fileExtension = file.name.split('.').pop();
      
      // Benzersiz dosya adı oluştur
      const fileName = `${userId}/${exchangeRequestId}/${type}/${uuidv4()}.${fileExtension}`;
      
      // Storage referansı oluştur
      const storageRef = ref(this.storage, fileName);
      
      // Dosyayı yükle
      await uploadBytes(storageRef, file);
      
      // İndirme URL'sini al
      const downloadURL = await getDownloadURL(storageRef);
      
      return {
        url: downloadURL,
        name: file.name
      };
    } catch (error) {
      console.error('Belge yüklenirken hata:', error);
      throw new Error('Belge yüklenemedi. Lütfen tekrar deneyin.');
    }
  }

  async deleteDocument(fileUrl: string): Promise<void> {
    try {
      // URL'den dosya yolunu çıkar
      const filePath = fileUrl.split('/o/')[1].split('?')[0];
      const decodedPath = decodeURIComponent(filePath);
      
      // Storage referansı oluştur
      const storageRef = ref(this.storage, decodedPath);
      
      // Dosyayı sil
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Belge silinirken hata:', error);
      throw new Error('Belge silinemedi. Lütfen tekrar deneyin.');
    }
  }

  validateFile(file: File): { isValid: boolean; error?: string } {
    // Dosya boyutu kontrolü (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Dosya boyutu 5MB\'dan küçük olmalıdır.'
      };
    }

    // Dosya tipi kontrolü
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Sadece PDF ve resim dosyaları yüklenebilir.'
      };
    }

    return { isValid: true };
  }
}

export const documentService = new DocumentService(); 