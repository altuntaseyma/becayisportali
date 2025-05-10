import { UserLocation } from '../types/user';

export const validation = {
  email: {
    required: 'E-posta adresi zorunludur',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Geçerli bir e-posta adresi giriniz'
    }
  },

  password: {
    required: 'Şifre zorunludur',
    minLength: {
      value: 6,
      message: 'Şifre en az 6 karakter olmalıdır'
    },
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      message: 'Şifre en az bir harf ve bir rakam içermelidir'
    }
  },

  displayName: {
    required: 'Ad Soyad zorunludur',
    minLength: {
      value: 3,
      message: 'Ad Soyad en az 3 karakter olmalıdır'
    },
    pattern: {
      value: /^[A-Za-zÇçĞğİıÖöŞşÜü\s]{3,}$/,
      message: 'Ad Soyad sadece harf içermelidir'
    }
  },

  title: {
    required: 'Başlık zorunludur',
    minLength: {
      value: 3,
      message: 'Başlık en az 3 karakter olmalıdır'
    },
    maxLength: {
      value: 100,
      message: 'Başlık en fazla 100 karakter olmalıdır'
    }
  },

  description: {
    maxLength: {
      value: 500,
      message: 'Açıklama en fazla 500 karakter olmalıdır'
    }
  },

  location: {
    required: 'Konum seçimi zorunludur'
  },

  desiredLocations: {
    required: 'En az bir istenen konum seçmelisiniz',
    validate: (value: UserLocation[]) => 
      value.length > 0 || 'En az bir istenen konum seçmelisiniz'
  },

  profession: {
    required: 'Meslek bilgisi zorunludur'
  },

  department: {
    required: 'Departman bilgisi zorunludur'
  },

  yearsOfService: {
    required: 'Hizmet yılı zorunludur',
    min: {
      value: 0,
      message: 'Hizmet yılı 0\'dan küçük olamaz'
    },
    max: {
      value: 50,
      message: 'Hizmet yılı 50\'den büyük olamaz'
    }
  },

  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string): boolean => {
    return password.length >= 6;
  },

  // Form validation rules for react-hook-form
  rules: {
    email: {
      required: 'E-posta adresi gereklidir',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Geçerli bir e-posta adresi giriniz'
      }
    },
    password: {
      required: 'Şifre gereklidir',
      minLength: {
        value: 6,
        message: 'Şifre en az 6 karakter olmalıdır'
      },
      pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        message: 'Şifre en az bir harf ve bir rakam içermelidir'
      }
    }
  }
};

export const validateForm = (values: any, rules: any) => {
  const errors: any = {};

  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];

    if (fieldRules.required && !value) {
      errors[field] = fieldRules.required;
    }

    if (value) {
      if (fieldRules.pattern && !fieldRules.pattern.value.test(value)) {
        errors[field] = fieldRules.pattern.message;
      }

      if (fieldRules.minLength && value.length < fieldRules.minLength.value) {
        errors[field] = fieldRules.minLength.message;
      }

      if (fieldRules.maxLength && value.length > fieldRules.maxLength.value) {
        errors[field] = fieldRules.maxLength.message;
      }

      if (fieldRules.min && value < fieldRules.min.value) {
        errors[field] = fieldRules.min.message;
      }

      if (fieldRules.max && value > fieldRules.max.value) {
        errors[field] = fieldRules.max.message;
      }

      if (fieldRules.validate) {
        const validateResult = fieldRules.validate(value);
        if (typeof validateResult === 'string') {
          errors[field] = validateResult;
        }
      }
    }
  });

  return errors;
}; 