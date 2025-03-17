interface KurumKategorileri {
  [key: string]: string[];
}

export const sehirler: string[] = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
  'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
  'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin',
  'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
  'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt',
  'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük',
  'Kilis', 'Osmaniye', 'Düzce'
].sort();

export const kurumKategorileri: KurumKategorileri = {
  'Bakanlıklar': [
    'Adalet Bakanlığı',
    'Aile ve Sosyal Hizmetler Bakanlığı',
    'Çalışma ve Sosyal Güvenlik Bakanlığı',
    'Çevre, Şehircilik ve İklim Değişikliği Bakanlığı',
    'Dışişleri Bakanlığı',
    'Enerji ve Tabii Kaynaklar Bakanlığı',
    'Gençlik ve Spor Bakanlığı',
    'Hazine ve Maliye Bakanlığı',
    'İçişleri Bakanlığı',
    'Kültür ve Turizm Bakanlığı',
    'Milli Eğitim Bakanlığı',
    'Milli Savunma Bakanlığı',
    'Sağlık Bakanlığı',
    'Sanayi ve Teknoloji Bakanlığı',
    'Tarım ve Orman Bakanlığı',
    'Ticaret Bakanlığı',
    'Ulaştırma ve Altyapı Bakanlığı'
  ],
  'Üniversiteler': [
    'Devlet Üniversiteleri',
  ],
  'Yerel Yönetimler': [
    'Belediyeler',
    'İl Özel İdareleri',
  ],
  'Diğer Kamu Kurumları': [
    'Devlet Su İşleri',
    'Karayolları Genel Müdürlüğü',
    'PTT',
    'TCDD',
    'TÜBİTAK',
    'Diğer'
  ]
}; 