interface KurumKategorileri {
  [key: string]: string[];
}

export const kurumTurleri = [
  'Bakanlık',
  'Üniversite',
  'Belediye',
  'Valilik',
  'Emniyet Müdürlüğü',
  'Milli Eğitim Müdürlüğü',
  'Sağlık Müdürlüğü',
  'Adliye',
  'Diğer'
] as const;

export const kurumKategorileri = [
  'Bakanlıklar',
  'Üniversiteler',
  'Yerel Yönetimler',
  'Diğer Kamu Kurumları'
] as const;

export const kurumlar: Record<string, string[]> = {
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
    'Abdullah Gül Üniversitesi',
    'Acıbadem Mehmet Ali Aydınlar Üniversitesi',
    'Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi',
    'Adıyaman Üniversitesi',
    'Afyon Kocatepe Üniversitesi',
    'Ağrı İbrahim Çeçen Üniversitesi',
    'Akdeniz Üniversitesi',
    'Aksaray Üniversitesi',
    'Alanya Alaaddin Keykubat Üniversitesi',
    'Amasya Üniversitesi',
    'Ankara Üniversitesi',
    'Ankara Hacı Bayram Veli Üniversitesi',
    'Ankara Medipol Üniversitesi',
    'Ankara Sosyal Bilimler Üniversitesi',
    'Ankara Yıldırım Beyazıt Üniversitesi',
    'Ardahan Üniversitesi',
    'Artvin Çoruh Üniversitesi',
    'Atatürk Üniversitesi',
    'Aydın Adnan Menderes Üniversitesi',
    'Balıkesir Üniversitesi',
    'Bandırma Onyedi Eylül Üniversitesi',
    'Bartın Üniversitesi',
    'Batman Üniversitesi',
    'Bayburt Üniversitesi',
    'Bilecik Şeyh Edebali Üniversitesi',
    'Bingöl Üniversitesi',
    'Bitlis Eren Üniversitesi',
    'Boğaziçi Üniversitesi',
    'Bolu Abant İzzet Baysal Üniversitesi',
    'Burdur Mehmet Akif Ersoy Üniversitesi',
    'Bursa Teknik Üniversitesi',
    'Bursa Uludağ Üniversitesi',
    'Çanakkale Onsekiz Mart Üniversitesi',
    'Çankırı Karatekin Üniversitesi',
    'Çukurova Üniversitesi',
    'Dicle Üniversitesi',
    'Dokuz Eylül Üniversitesi',
    'Düzce Üniversitesi',
    'Ege Üniversitesi',
    'Erciyes Üniversitesi',
    'Erzincan Binali Yıldırım Üniversitesi',
    'Erzurum Teknik Üniversitesi',
    'Eskişehir Osmangazi Üniversitesi',
    'Eskişehir Teknik Üniversitesi',
    'Fırat Üniversitesi',
    'Galatasaray Üniversitesi',
    'Gazi Üniversitesi',
    'Gaziantep Üniversitesi',
    'Gaziantep İslam Bilim ve Teknoloji Üniversitesi',
    'Gebze Teknik Üniversitesi',
    'Giresun Üniversitesi',
    'Gümüşhane Üniversitesi',
    'Hacettepe Üniversitesi',
    'Hakkari Üniversitesi',
    'Harran Üniversitesi',
    'Hatay Mustafa Kemal Üniversitesi',
    'Hitit Üniversitesi',
    'Iğdır Üniversitesi',
    'Isparta Uygulamalı Bilimler Üniversitesi',
    'İnönü Üniversitesi',
    'İskenderun Teknik Üniversitesi',
    'İstanbul Üniversitesi',
    'İstanbul Cerrahpaşa Üniversitesi',
    'İstanbul Medeniyet Üniversitesi',
    'İstanbul Teknik Üniversitesi',
    'İzmir Bakırçay Üniversitesi',
    'İzmir Demokrasi Üniversitesi',
    'İzmir Kâtip Çelebi Üniversitesi',
    'İzmir Yüksek Teknoloji Enstitüsü',
    'Kafkas Üniversitesi',
    'Kahramanmaraş İstiklal Üniversitesi',
    'Kahramanmaraş Sütçü İmam Üniversitesi',
    'Karabük Üniversitesi',
    'Karadeniz Teknik Üniversitesi',
    'Karamanoğlu Mehmetbey Üniversitesi',
    'Kastamonu Üniversitesi',
    'Kayseri Üniversitesi',
    'Kırıkkale Üniversitesi',
    'Kırklareli Üniversitesi',
    'Kırşehir Ahi Evran Üniversitesi',
    'Kilis 7 Aralık Üniversitesi',
    'Kocaeli Üniversitesi',
    'Konya Teknik Üniversitesi',
    'Kütahya Dumlupınar Üniversitesi',
    'Kütahya Sağlık Bilimleri Üniversitesi',
    'Malatya Turgut Özal Üniversitesi',
    'Manisa Celal Bayar Üniversitesi',
    'Mardin Artuklu Üniversitesi',
    'Marmara Üniversitesi',
    'Mersin Üniversitesi',
    'Mimar Sinan Güzel Sanatlar Üniversitesi',
    'Muğla Sıtkı Koçman Üniversitesi',
    'Munzur Üniversitesi',
    'Muş Alparslan Üniversitesi',
    'Necmettin Erbakan Üniversitesi',
    'Nevşehir Hacı Bektaş Veli Üniversitesi',
    'Niğde Ömer Halisdemir Üniversitesi',
    'Ondokuz Mayıs Üniversitesi',
    'Ordu Üniversitesi',
    'Osmaniye Korkut Ata Üniversitesi',
    'Pamukkale Üniversitesi',
    'Recep Tayyip Erdoğan Üniversitesi',
    'Sakarya Üniversitesi',
    'Sakarya Uygulamalı Bilimler Üniversitesi',
    'Samsun Üniversitesi',
    'Selçuk Üniversitesi',
    'Siirt Üniversitesi',
    'Sinop Üniversitesi',
    'Sivas Cumhuriyet Üniversitesi',
    'Süleyman Demirel Üniversitesi',
    'Şırnak Üniversitesi',
    'Tarsus Üniversitesi',
    'Tekirdağ Namık Kemal Üniversitesi',
    'Tokat Gaziosmanpaşa Üniversitesi',
    'Trabzon Üniversitesi',
    'Trakya Üniversitesi',
    'Türk-Alman Üniversitesi',
    'Uşak Üniversitesi',
    'Van Yüzüncü Yıl Üniversitesi',
    'Yalova Üniversitesi',
    'Yozgat Bozok Üniversitesi',
    'Zonguldak Bülent Ecevit Üniversitesi'
  ],
  'Yerel Yönetimler': [
    'Adana Büyükşehir Belediyesi',
    'Ankara Büyükşehir Belediyesi',
    'Antalya Büyükşehir Belediyesi',
    'Aydın Büyükşehir Belediyesi',
    'Balıkesir Büyükşehir Belediyesi',
    'Bursa Büyükşehir Belediyesi',
    'Denizli Büyükşehir Belediyesi',
    'Diyarbakır Büyükşehir Belediyesi',
    'Erzurum Büyükşehir Belediyesi',
    'Eskişehir Büyükşehir Belediyesi',
    'Gaziantep Büyükşehir Belediyesi',
    'Hatay Büyükşehir Belediyesi',
    'İstanbul Büyükşehir Belediyesi',
    'İzmir Büyükşehir Belediyesi',
    'Kahramanmaraş Büyükşehir Belediyesi',
    'Kayseri Büyükşehir Belediyesi',
    'Kocaeli Büyükşehir Belediyesi',
    'Konya Büyükşehir Belediyesi',
    'Malatya Büyükşehir Belediyesi',
    'Manisa Büyükşehir Belediyesi',
    'Mardin Büyükşehir Belediyesi',
    'Mersin Büyükşehir Belediyesi',
    'Muğla Büyükşehir Belediyesi',
    'Ordu Büyükşehir Belediyesi',
    'Sakarya Büyükşehir Belediyesi',
    'Samsun Büyükşehir Belediyesi',
    'Şanlıurfa Büyükşehir Belediyesi',
    'Tekirdağ Büyükşehir Belediyesi',
    'Trabzon Büyükşehir Belediyesi',
    'Van Büyükşehir Belediyesi'
  ],
  'Diğer Kamu Kurumları': [
    'Türkiye Büyük Millet Meclisi',
    'Cumhurbaşkanlığı',
    'Sayıştay Başkanlığı',
    'Türkiye İstatistik Kurumu',
    'Türkiye İş Kurumu',
    'Sosyal Güvenlik Kurumu',
    'Devlet Su İşleri Genel Müdürlüğü',
    'Karayolları Genel Müdürlüğü',
    'Tapu ve Kadastro Genel Müdürlüğü',
    'Türkiye Cumhuriyet Merkez Bankası',
    'Türkiye Radyo Televizyon Kurumu',
    'Yükseköğretim Kurulu Başkanlığı',
    'ÖSYM Başkanlığı',
    'Türk Patent ve Marka Kurumu',
    'Türkiye Bilimsel ve Teknolojik Araştırma Kurumu',
    'Türkiye Atom Enerjisi Kurumu',
    'Türkiye Sağlık Enstitüleri Başkanlığı',
    'Milli Piyango İdaresi Genel Müdürlüğü',
    'Spor Toto Teşkilat Başkanlığı',
    'Vakıflar Genel Müdürlüğü',
    'Diyanet İşleri Başkanlığı',
    'Türkiye Yazma Eserler Kurumu Başkanlığı',
    'Türk Akreditasyon Kurumu',
    'Türk Standardları Enstitüsü',
    'Türkiye ve Orta Doğu Amme İdaresi Enstitüsü',
    'Türkiye Adalet Akademisi',
    'Milli Savunma Üniversitesi',
    'Polis Akademisi Başkanlığı',
    'Jandarma ve Sahil Güvenlik Akademisi'
  ]
};

export const altKurumlar = {
  'Belediyeler': [
    'Adana Büyükşehir Belediyesi',
    'Ankara Büyükşehir Belediyesi',
    'Antalya Büyükşehir Belediyesi',
    'Aydın Büyükşehir Belediyesi',
    'Balıkesir Büyükşehir Belediyesi',
    'Bursa Büyükşehir Belediyesi',
    'Denizli Büyükşehir Belediyesi',
    'Diyarbakır Büyükşehir Belediyesi',
    'Erzurum Büyükşehir Belediyesi',
    'Eskişehir Büyükşehir Belediyesi',
    'Gaziantep Büyükşehir Belediyesi',
    'Hatay Büyükşehir Belediyesi',
    'İstanbul Büyükşehir Belediyesi',
    'İzmir Büyükşehir Belediyesi',
    'Kahramanmaraş Büyükşehir Belediyesi',
    'Kayseri Büyükşehir Belediyesi',
    'Kocaeli Büyükşehir Belediyesi',
    'Konya Büyükşehir Belediyesi',
    'Malatya Büyükşehir Belediyesi',
    'Manisa Büyükşehir Belediyesi',
    'Mardin Büyükşehir Belediyesi',
    'Mersin Büyükşehir Belediyesi',
    'Muğla Büyükşehir Belediyesi',
    'Ordu Büyükşehir Belediyesi',
    'Sakarya Büyükşehir Belediyesi',
    'Samsun Büyükşehir Belediyesi',
    'Şanlıurfa Büyükşehir Belediyesi',
    'Tekirdağ Büyükşehir Belediyesi',
    'Trabzon Büyükşehir Belediyesi',
    'Van Büyükşehir Belediyesi'
  ],
  'İl Özel İdareleri': [
    'Adana İl Özel İdaresi',
    'Ankara İl Özel İdaresi',
    'Antalya İl Özel İdaresi',
    'Bursa İl Özel İdaresi',
    'İstanbul İl Özel İdaresi',
    'İzmir İl Özel İdaresi',
    'Konya İl Özel İdaresi'
  ]
};

export const iller = [
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
] as const;

export const ilceler: Record<string, string[]> = {
  'Adana': [
    'Aladağ', 'Ceyhan', 'Çukurova', 'Feke', 'İmamoğlu', 'Karaisalı', 'Karataş', 'Kozan',
    'Pozantı', 'Saimbeyli', 'Sarıçam', 'Seyhan', 'Tufanbeyli', 'Yumurtalık', 'Yüreğir'
  ],
  'Adıyaman': [
    'Besni', 'Çelikhan', 'Gerger', 'Gölbaşı', 'Kahta', 'Merkez', 'Samsat', 'Sincik', 'Tut'
  ],
  'Afyonkarahisar': [
    'Başmakçı', 'Bayat', 'Bolvadin', 'Çay', 'Çobanlar', 'Dazkırı', 'Dinar', 'Emirdağ',
    'Evciler', 'Hocalar', 'İhsaniye', 'İscehisar', 'Kızılören', 'Merkez', 'Sandıklı',
    'Sinanpaşa', 'Sultandağı', 'Şuhut'
  ],
  'Ağrı': [
    'Diyadin', 'Doğubayazıt', 'Eleşkirt', 'Hamur', 'Merkez', 'Patnos', 'Taşlıçay', 'Tutak'
  ],
  'Amasya': [
    'Göynücek', 'Gümüşhacıköy', 'Hamamözü', 'Merkez', 'Merzifon', 'Suluova', 'Taşova'
  ],
  'Ankara': [
    'Akyurt', 'Altındağ', 'Ayaş', 'Bala', 'Beypazarı', 'Çamlıdere', 'Çankaya', 'Çubuk',
    'Elmadağ', 'Etimesgut', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kalecik', 'Kahramankazan',
    'Keçiören', 'Kızılcahamam', 'Mamak', 'Nallıhan', 'Polatlı', 'Pursaklar', 'Sincan',
    'Şereflikoçhisar', 'Yenimahalle'
  ],
  'Antalya': [
    'Akseki', 'Aksu', 'Alanya', 'Demre', 'Döşemealtı', 'Elmalı', 'Finike', 'Gazipaşa',
    'Gündoğmuş', 'İbradı', 'Kaş', 'Kemer', 'Kepez', 'Konyaaltı', 'Korkuteli', 'Kumluca',
    'Manavgat', 'Muratpaşa', 'Serik'
  ],
  'Artvin': [
    'Ardanuç', 'Arhavi', 'Borçka', 'Hopa', 'Kemalpaşa', 'Merkez', 'Murgul', 'Şavşat', 'Yusufeli'
  ],
  'Aydın': [
    'Bozdoğan', 'Buharkent', 'Çine', 'Didim', 'Efeler', 'Germencik', 'İncirliova',
    'Karacasu', 'Karpuzlu', 'Koçarlı', 'Köşk', 'Kuşadası', 'Kuyucak', 'Nazilli',
    'Söke', 'Sultanhisar', 'Yenipazar'
  ],
  'Balıkesir': [
    'Altıeylül', 'Ayvalık', 'Balya', 'Bandırma', 'Bigadiç', 'Burhaniye', 'Dursunbey',
    'Edremit', 'Erdek', 'Gömeç', 'Gönen', 'Havran', 'İvrindi', 'Karesi', 'Kepsut',
    'Manyas', 'Marmara', 'Savaştepe', 'Sındırgı', 'Susurluk'
  ],
  'Bilecik': [
    'Bozüyük', 'Gölpazarı', 'İnhisar', 'Merkez', 'Osmaneli', 'Pazaryeri', 'Söğüt', 'Yenipazar'
  ],
  'Bingöl': [
    'Adaklı', 'Genç', 'Karlıova', 'Kiğı', 'Merkez', 'Solhan', 'Yayladere', 'Yedisu'
  ],
  'Bitlis': [
    'Adilcevaz', 'Ahlat', 'Güroymak', 'Hizan', 'Merkez', 'Mutki', 'Tatvan'
  ],
  'Bolu': [
    'Dörtdivan', 'Gerede', 'Göynük', 'Kıbrıscık', 'Mengen', 'Merkez', 'Mudurnu', 'Seben', 'Yeniçağa'
  ],
  'Burdur': [
    'Ağlasun', 'Altınyayla', 'Bucak', 'Çavdır', 'Çeltikçi', 'Gölhisar', 'Karamanlı',
    'Kemer', 'Merkez', 'Tefenni', 'Yeşilova'
  ],
  'İstanbul': [
    'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy',
    'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece',
    'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa',
    'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik',
    'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli',
    'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'
  ],
  'Ankara': [
    'Akyurt', 'Altındağ', 'Ayaş', 'Bala', 'Beypazarı', 'Çamlıdere', 'Çankaya', 'Çubuk',
    'Elmadağ', 'Etimesgut', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kalecik', 'Kahramankazan',
    'Keçiören', 'Kızılcahamam', 'Mamak', 'Nallıhan', 'Polatlı', 'Pursaklar', 'Sincan',
    'Şereflikoçhisar', 'Yenimahalle'
  ],
  'İzmir': [
    'Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Beydağ', 'Bornova', 'Buca',
    'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun',
    'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere',
    'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'
  ],
  'Bursa': [
    'Büyükorhan', 'Gemlik', 'Gürsu', 'Harmancık', 'İnegöl', 'İznik', 'Karacabey', 'Keles',
    'Kestel', 'Mudanya', 'Mustafakemalpaşa', 'Nilüfer', 'Orhaneli', 'Orhangazi', 'Osmangazi',
    'Yenişehir', 'Yıldırım'
  ],
  'Antalya': [
    'Akseki', 'Aksu', 'Alanya', 'Demre', 'Döşemealtı', 'Elmalı', 'Finike', 'Gazipaşa',
    'Gündoğmuş', 'İbradı', 'Kaş', 'Kemer', 'Kepez', 'Konyaaltı', 'Korkuteli', 'Kumluca',
    'Manavgat', 'Muratpaşa', 'Serik'
  ],
  'Adana': [
    'Aladağ', 'Ceyhan', 'Çukurova', 'Feke', 'İmamoğlu', 'Karaisalı', 'Karataş', 'Kozan',
    'Pozantı', 'Saimbeyli', 'Sarıçam', 'Seyhan', 'Tufanbeyli', 'Yumurtalık', 'Yüreğir'
  ],
  'Konya': [
    'Ahırlı', 'Akören', 'Akşehir', 'Altınekin', 'Beyşehir', 'Bozkır', 'Çeltik', 'Cihanbeyli',
    'Çumra', 'Derbent', 'Derebucak', 'Doğanhisar', 'Emirgazi', 'Ereğli', 'Güneysınır',
    'Hadim', 'Halkapınar', 'Hüyük', 'Ilgın', 'Kadınhanı', 'Karapınar', 'Karatay',
    'Kulu', 'Meram', 'Sarayönü', 'Selçuklu', 'Seydişehir', 'Taşkent', 'Tuzlukçu',
    'Yalıhüyük', 'Yunak'
  ],
  'Gaziantep': [
    'Araban', 'İslahiye', 'Karkamış', 'Nizip', 'Nurdağı', 'Oğuzeli', 'Şahinbey',
    'Şehitkamil', 'Yavuzeli'
  ],
  'Mersin': [
    'Akdeniz', 'Anamur', 'Aydıncık', 'Bozyazı', 'Çamlıyayla', 'Erdemli', 'Gülnar',
    'Mezitli', 'Mut', 'Silifke', 'Tarsus', 'Toroslar', 'Yenişehir'
  ],
  'Eskişehir': [
    'Alpu', 'Beylikova', 'Çifteler', 'Günyüzü', 'Han', 'İnönü', 'Mahmudiye',
    'Mihalgazi', 'Mihalıççık', 'Odunpazarı', 'Sarıcakaya', 'Seyitgazi',
    'Sivrihisar', 'Tepebaşı'
  ],
  'Kayseri': [
    'Akkışla', 'Bünyan', 'Develi', 'Felahiye', 'Hacılar', 'İncesu', 'Kocasinan',
    'Melikgazi', 'Özvatan', 'Pınarbaşı', 'Sarıoğlan', 'Sarız', 'Talas', 'Tomarza',
    'Yahyalı', 'Yeşilhisar'
  ],
  'Diyarbakır': [
    'Bağlar', 'Bismil', 'Çermik', 'Çınar', 'Çüngüş', 'Dicle', 'Eğil', 'Ergani',
    'Hani', 'Hazro', 'Kayapınar', 'Kocaköy', 'Kulp', 'Lice', 'Silvan', 'Sur',
    'Yenişehir'
  ],
  'Samsun': [
    'Alaçam', 'Asarcık', 'Atakum', 'Ayvacık', 'Bafra', 'Canik', 'Çarşamba',
    'Havza', 'İlkadım', 'Kavak', 'Ladik', 'Ondokuzmayıs', 'Salıpazarı',
    'Tekkeköy', 'Terme', 'Vezirköprü', 'Yakakent'
  ],
  'Denizli': [
    'Acıpayam', 'Babadağ', 'Baklan', 'Bekilli', 'Beyağaç', 'Bozkurt', 'Buldan',
    'Çal', 'Çameli', 'Çardak', 'Çivril', 'Güney', 'Honaz', 'Kale', 'Merkezefendi',
    'Pamukkale', 'Sarayköy', 'Serinhisar', 'Tavas'
  ],
  'Şanlıurfa': [
    'Akçakale', 'Birecik', 'Bozova', 'Ceylanpınar', 'Eyyübiye', 'Halfeti',
    'Haliliye', 'Harran', 'Hilvan', 'Karaköprü', 'Siverek', 'Suruç', 'Viranşehir'
  ],
  'Trabzon': [
    'Akçaabat', 'Araklı', 'Arsin', 'Beşikdüzü', 'Çarşıbaşı', 'Çaykara', 'Dernekpazarı',
    'Düzköy', 'Hayrat', 'Köprübaşı', 'Maçka', 'Of', 'Ortahisar', 'Sürmene', 'Şalpazarı',
    'Tonya', 'Vakfıkebir', 'Yomra'
  ],
  'Balıkesir': [
    'Altıeylül', 'Ayvalık', 'Balya', 'Bandırma', 'Bigadiç', 'Burhaniye', 'Dursunbey',
    'Edremit', 'Erdek', 'Gömeç', 'Gönen', 'Havran', 'İvrindi', 'Karesi', 'Kepsut',
    'Manyas', 'Marmara', 'Savaştepe', 'Sındırgı', 'Susurluk'
  ],
  'Manisa': [
    'Ahmetli', 'Akhisar', 'Alaşehir', 'Demirci', 'Gölmarmara', 'Gördes', 'Kırkağaç',
    'Köprübaşı', 'Kula', 'Salihli', 'Sarıgöl', 'Saruhanlı', 'Selendi', 'Soma',
    'Şehzadeler', 'Turgutlu', 'Yunusemre'
  ],
  'Kahramanmaraş': [
    'Afşin', 'Andırın', 'Çağlayancerit', 'Dulkadiroğlu', 'Ekinözü', 'Elbistan',
    'Göksun', 'Nurhak', 'Onikişubat', 'Pazarcık', 'Türkoğlu'
  ],
  'Van': [
    'Bahçesaray', 'Başkale', 'Çaldıran', 'Çatak', 'Edremit', 'Erciş', 'Gevaş',
    'Gürpınar', 'İpekyolu', 'Muradiye', 'Özalp', 'Saray', 'Tuşba'
  ],
  'Aydın': [
    'Bozdoğan', 'Buharkent', 'Çine', 'Didim', 'Efeler', 'Germencik', 'İncirliova',
    'Karacasu', 'Karpuzlu', 'Koçarlı', 'Köşk', 'Kuşadası', 'Kuyucak', 'Nazilli',
    'Söke', 'Sultanhisar', 'Yenipazar'
  ],
  'Tekirdağ': [
    'Çerkezköy', 'Çorlu', 'Ergene', 'Hayrabolu', 'Kapaklı', 'Malkara', 'Marmaraereğlisi',
    'Muratlı', 'Saray', 'Süleymanpaşa', 'Şarköy'
  ],
  'Sakarya': [
    'Adapazarı', 'Akyazı', 'Arifiye', 'Erenler', 'Ferizli', 'Geyve', 'Hendek',
    'Karapürçek', 'Karasu', 'Kaynarca', 'Kocaali', 'Pamukova', 'Sapanca', 'Serdivan',
    'Söğütlü', 'Taraklı'
  ],
  'Hatay': [
    'Altınözü', 'Antakya', 'Arsuz', 'Belen', 'Defne', 'Dörtyol', 'Erzin', 'Hassa',
    'İskenderun', 'Kırıkhan', 'Kumlu', 'Payas', 'Reyhanlı', 'Samandağ', 'Yayladağı'
  ],
  'Ordu': [
    'Akkuş', 'Altınordu', 'Aybastı', 'Çamaş', 'Çatalpınar', 'Çaybaşı', 'Fatsa',
    'Gölköy', 'Gülyalı', 'Gürgentepe', 'İkizce', 'Kabadüz', 'Kabataş', 'Korgan',
    'Kumru', 'Mesudiye', 'Perşembe', 'Ulubey', 'Ünye'
  ],
  'Muğla': [
    'Bodrum', 'Dalaman', 'Datça', 'Fethiye', 'Kavaklıdere', 'Köyceğiz', 'Marmaris',
    'Menteşe', 'Milas', 'Ortaca', 'Seydikemer', 'Ula', 'Yatağan'
  ],
  'Malatya': [
    'Akçadağ', 'Arapgir', 'Arguvan', 'Battalgazi', 'Darende', 'Doğanşehir', 'Doğanyol',
    'Hekimhan', 'Kale', 'Kuluncak', 'Pütürge', 'Yazıhan', 'Yeşilyurt'
  ],
  'Mardin': [
    'Artuklu', 'Dargeçit', 'Derik', 'Kızıltepe', 'Mazıdağı', 'Midyat', 'Nusaybin',
    'Ömerli', 'Savur', 'Yeşilli'
  ],
  'Erzurum': [
    'Aşkale', 'Aziziye', 'Çat', 'Hınıs', 'Horasan', 'İspir', 'Karaçoban', 'Karayazı',
    'Köprüköy', 'Narman', 'Oltu', 'Olur', 'Palandöken', 'Pasinler', 'Pazaryolu',
    'Şenkaya', 'Tekman', 'Tortum', 'Uzundere', 'Yakutiye'
  ],
  'Sivas': [
    'Akıncılar', 'Altınyayla', 'Divriği', 'Doğanşar', 'Gemerek', 'Gölova', 'Hafik',
    'İmranlı', 'Kangal', 'Koyulhisar', 'Merkez', 'Suşehri', 'Şarkışla', 'Ulaş',
    'Yıldızeli', 'Zara'
  ],
  'Adıyaman': [
    'Besni', 'Çelikhan', 'Gerger', 'Gölbaşı', 'Kahta', 'Merkez', 'Samsat', 'Sincik',
    'Tut'
  ],
  'Tokat': [
    'Almus', 'Artova', 'Başçiftlik', 'Erbaa', 'Merkez', 'Niksar', 'Pazar', 'Reşadiye',
    'Sulusaray', 'Turhal', 'Yeşilyurt', 'Zile'
  ],
  'Afyonkarahisar': [
    'Başmakçı', 'Bayat', 'Bolvadin', 'Çay', 'Çobanlar', 'Dazkırı', 'Dinar', 'Emirdağ',
    'Evciler', 'Hocalar', 'İhsaniye', 'İscehisar', 'Kızılören', 'Merkez', 'Sandıklı',
    'Sinanpaşa', 'Sultandağı', 'Şuhut'
  ],
  'Zonguldak': [
    'Alaplı', 'Çaycuma', 'Devrek', 'Ereğli', 'Gökçebey', 'Kilimli', 'Kozlu', 'Merkez'
  ],
  'Kütahya': [
    'Altıntaş', 'Aslanapa', 'Çavdarhisar', 'Domaniç', 'Dumlupınar', 'Emet', 'Gediz',
    'Hisarcık', 'Merkez', 'Pazarlar', 'Şaphane', 'Simav', 'Tavşanlı'
  ],
  'Elazığ': [
    'Ağın', 'Alacakaya', 'Arıcak', 'Baskil', 'Karakoçan', 'Keban', 'Kovancılar',
    'Maden', 'Merkez', 'Palu', 'Sivrice'
  ],
  'Çorum': [
    'Alaca', 'Bayat', 'Boğazkale', 'Dodurga', 'İskilip', 'Kargı', 'Laçin', 'Mecitözü',
    'Merkez', 'Oğuzlar', 'Ortaköy', 'Osmancık', 'Sungurlu', 'Uğurludağ'
  ],
  'Batman': [
    'Beşiri', 'Gercüş', 'Hasankeyf', 'Kozluk', 'Merkez', 'Sason'
  ],
  'Rize': [
    'Ardeşen', 'Çamlıhemşin', 'Çayeli', 'Derepazarı', 'Fındıklı', 'Güneysu',
    'Hemşin', 'İkizdere', 'İyidere', 'Kalkandere', 'Merkez', 'Pazar'
  ],
  'Aksaray': [
    'Ağaçören', 'Eskil', 'Gülağaç', 'Güzelyurt', 'Merkez', 'Ortaköy', 'Sarıyahşi',
    'Sultanhanı'
  ],
  'Karaman': [
    'Ayrancı', 'Başyayla', 'Ermenek', 'Kazımkarabekir', 'Merkez', 'Sarıveliler'
  ],
  'Kırıkkale': [
    'Bahşılı', 'Balışeyh', 'Çelebi', 'Delice', 'Karakeçili', 'Keskin', 'Merkez',
    'Sulakyurt', 'Yahşihan'
  ],
  'Düzce': [
    'Akçakoca', 'Çilimli', 'Cumayeri', 'Gölyaka', 'Gümüşova', 'Kaynaşlı', 'Merkez',
    'Yığılca'
  ],
  'Uşak': [
    'Banaz', 'Eşme', 'Karahallı', 'Merkez', 'Sivaslı', 'Ulubey'
  ],
  'Kastamonu': [
    'Abana', 'Ağlı', 'Araç', 'Azdavay', 'Bozkurt', 'Cide', 'Çatalzeytin', 'Daday',
    'Devrekani', 'Doğanyurt', 'Hanönü', 'İhsangazi', 'İnebolu', 'Küre', 'Merkez',
    'Pınarbaşı', 'Şenpazar', 'Seydiler', 'Taşköprü', 'Tosya'
  ],
  'Osmaniye': [
    'Bahçe', 'Düziçi', 'Hasanbeyli', 'Kadirli', 'Merkez', 'Sumbas', 'Toprakkale'
  ],
  'Çanakkale': [
    'Ayvacık', 'Bayramiç', 'Biga', 'Bozcaada', 'Çan', 'Eceabat', 'Ezine', 'Gelibolu',
    'Gökçeada', 'Lapseki', 'Merkez', 'Yenice'
  ],
  'Çankırı': [
    'Atkaracalar', 'Bayramören', 'Çerkeş', 'Eldivan', 'Ilgaz', 'Kızılırmak', 'Korgun',
    'Kurşunlu', 'Merkez', 'Orta', 'Şabanözü', 'Yapraklı'
  ],
  'Edirne': [
    'Enez', 'Havsa', 'İpsala', 'Keşan', 'Lalapaşa', 'Meriç', 'Merkez', 'Süloğlu', 'Uzunköprü'
  ],
  'Erzincan': [
    'Çayırlı', 'İliç', 'Kemah', 'Kemaliye', 'Merkez', 'Otlukbeli', 'Refahiye',
    'Tercan', 'Üzümlü'
  ],
  'Erzurum': [
    'Aşkale', 'Aziziye', 'Çat', 'Hınıs', 'Horasan', 'İspir', 'Karaçoban', 'Karayazı',
    'Köprüköy', 'Narman', 'Oltu', 'Olur', 'Palandöken', 'Pasinler', 'Pazaryolu',
    'Şenkaya', 'Tekman', 'Tortum', 'Uzundere', 'Yakutiye'
  ],
  'Eskişehir': [
    'Alpu', 'Beylikova', 'Çifteler', 'Günyüzü', 'Han', 'İnönü', 'Mahmudiye',
    'Mihalgazi', 'Mihalıççık', 'Odunpazarı', 'Sarıcakaya', 'Seyitgazi',
    'Sivrihisar', 'Tepebaşı'
  ],
  'Gaziantep': [
    'Araban', 'İslahiye', 'Karkamış', 'Nizip', 'Nurdağı', 'Oğuzeli', 'Şahinbey',
    'Şehitkamil', 'Yavuzeli'
  ],
  'Giresun': [
    'Alucra', 'Bulancak', 'Çamoluk', 'Çanakçı', 'Dereli', 'Doğankent', 'Espiye',
    'Eynesil', 'Görele', 'Güce', 'Keşap', 'Merkez', 'Piraziz', 'Şebinkarahisar',
    'Tirebolu', 'Yağlıdere'
  ],
  'Gümüşhane': [
    'Kelkit', 'Köse', 'Kürtün', 'Merkez', 'Şiran', 'Torul'
  ]
};

Object.assign(ilceler, {
  'Hakkari': [
    'Çukurca', 'Derecik', 'Merkez', 'Şemdinli', 'Yüksekova'
  ],
  'Hatay': [
    'Altınözü', 'Antakya', 'Arsuz', 'Belen', 'Defne', 'Dörtyol', 'Erzin', 'Hassa',
    'İskenderun', 'Kırıkhan', 'Kumlu', 'Payas', 'Reyhanlı', 'Samandağ', 'Yayladağı'
  ],
  'Isparta': [
    'Aksu', 'Atabey', 'Eğirdir', 'Gelendost', 'Gönen', 'Keçiborlu', 'Merkez',
    'Senirkent', 'Sütçüler', 'Şarkikaraağaç', 'Uluborlu', 'Yalvaç', 'Yenişarbademli'
  ],
  'Mersin': [
    'Akdeniz', 'Anamur', 'Aydıncık', 'Bozyazı', 'Çamlıyayla', 'Erdemli', 'Gülnar',
    'Mezitli', 'Mut', 'Silifke', 'Tarsus', 'Toroslar', 'Yenişehir'
  ],
  'İstanbul': [
    'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy',
    'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece',
    'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa',
    'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik',
    'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli',
    'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'
  ],
  'İzmir': [
    'Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Beydağ', 'Bornova', 'Buca',
    'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun',
    'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere',
    'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'
  ],
  'Kars': [
    'Akyaka', 'Arpaçay', 'Digor', 'Kağızman', 'Merkez', 'Sarıkamış', 'Selim', 'Susuz'
  ],
  'Kastamonu': [
    'Abana', 'Ağlı', 'Araç', 'Azdavay', 'Bozkurt', 'Cide', 'Çatalzeytin', 'Daday',
    'Devrekani', 'Doğanyurt', 'Hanönü', 'İhsangazi', 'İnebolu', 'Küre', 'Merkez',
    'Pınarbaşı', 'Şenpazar', 'Seydiler', 'Taşköprü', 'Tosya'
  ],
  'Kayseri': [
    'Akkışla', 'Bünyan', 'Develi', 'Felahiye', 'Hacılar', 'İncesu', 'Kocasinan',
    'Melikgazi', 'Özvatan', 'Pınarbaşı', 'Sarıoğlan', 'Sarız', 'Talas', 'Tomarza',
    'Yahyalı', 'Yeşilhisar'
  ],
  'Kırklareli': [
    'Babaeski', 'Demirköy', 'Kofçaz', 'Lüleburgaz', 'Merkez', 'Pehlivanköy',
    'Pınarhisar', 'Vize'
  ],
  'Kırşehir': [
    'Akçakent', 'Akpınar', 'Boztepe', 'Çiçekdağı', 'Kaman', 'Merkez', 'Mucur'
  ],
  'Kocaeli': [
    'Başiskele', 'Çayırova', 'Darıca', 'Derince', 'Dilovası', 'Gebze', 'Gölcük',
    'İzmit', 'Kandıra', 'Karamürsel', 'Kartepe', 'Körfez'
  ],
  'Kütahya': [
    'Altıntaş', 'Aslanapa', 'Çavdarhisar', 'Domaniç', 'Dumlupınar', 'Emet', 'Gediz',
    'Hisarcık', 'Merkez', 'Pazarlar', 'Şaphane', 'Simav', 'Tavşanlı'
  ],
  'Malatya': [
    'Akçadağ', 'Arapgir', 'Arguvan', 'Battalgazi', 'Darende', 'Doğanşehir', 'Doğanyol',
    'Hekimhan', 'Kale', 'Kuluncak', 'Pütürge', 'Yazıhan', 'Yeşilyurt'
  ],
  'Manisa': [
    'Ahmetli', 'Akhisar', 'Alaşehir', 'Demirci', 'Gölmarmara', 'Gördes', 'Kırkağaç',
    'Köprübaşı', 'Kula', 'Salihli', 'Sarıgöl', 'Saruhanlı', 'Selendi', 'Soma',
    'Şehzadeler', 'Turgutlu', 'Yunusemre'
  ],
  'Kahramanmaraş': [
    'Afşin', 'Andırın', 'Çağlayancerit', 'Dulkadiroğlu', 'Ekinözü', 'Elbistan',
    'Göksun', 'Nurhak', 'Onikişubat', 'Pazarcık', 'Türkoğlu'
  ],
  'Mardin': [
    'Artuklu', 'Dargeçit', 'Derik', 'Kızıltepe', 'Mazıdağı', 'Midyat', 'Nusaybin',
    'Ömerli', 'Savur', 'Yeşilli'
  ],
  'Muğla': [
    'Bodrum', 'Dalaman', 'Datça', 'Fethiye', 'Kavaklıdere', 'Köyceğiz', 'Marmaris',
    'Menteşe', 'Milas', 'Ortaca', 'Seydikemer', 'Ula', 'Yatağan'
  ],
  'Muş': [
    'Bulanık', 'Hasköy', 'Korkut', 'Malazgirt', 'Merkez', 'Varto'
  ],
  'Nevşehir': [
    'Acıgöl', 'Avanos', 'Derinkuyu', 'Gülşehir', 'Hacıbektaş', 'Kozaklı', 'Merkez', 'Ürgüp'
  ],
  'Niğde': [
    'Altunhisar', 'Bor', 'Çamardı', 'Çiftlik', 'Merkez', 'Ulukışla'
  ],
  'Ordu': [
    'Akkuş', 'Altınordu', 'Aybastı', 'Çamaş', 'Çatalpınar', 'Çaybaşı', 'Fatsa',
    'Gölköy', 'Gülyalı', 'Gürgentepe', 'İkizce', 'Kabadüz', 'Kabataş', 'Korgan',
    'Kumru', 'Mesudiye', 'Perşembe', 'Ulubey', 'Ünye'
  ],
  'Rize': [
    'Ardeşen', 'Çamlıhemşin', 'Çayeli', 'Derepazarı', 'Fındıklı', 'Güneysu',
    'Hemşin', 'İkizdere', 'İyidere', 'Kalkandere', 'Merkez', 'Pazar'
  ],
  'Sakarya': [
    'Adapazarı', 'Akyazı', 'Arifiye', 'Erenler', 'Ferizli', 'Geyve', 'Hendek',
    'Karapürçek', 'Karasu', 'Kaynarca', 'Kocaali', 'Pamukova', 'Sapanca', 'Serdivan',
    'Söğütlü', 'Taraklı'
  ],
  'Samsun': [
    'Alaçam', 'Asarcık', 'Atakum', 'Ayvacık', 'Bafra', 'Canik', 'Çarşamba',
    'Havza', 'İlkadım', 'Kavak', 'Ladik', 'Ondokuzmayıs', 'Salıpazarı',
    'Tekkeköy', 'Terme', 'Vezirköprü', 'Yakakent'
  ],
  'Siirt': [
    'Baykan', 'Eruh', 'Kurtalan', 'Merkez', 'Pervari', 'Şirvan', 'Tillo'
  ],
  'Sinop': [
    'Ayancık', 'Boyabat', 'Dikmen', 'Durağan', 'Erfelek', 'Gerze', 'Merkez',
    'Saraydüzü', 'Türkeli'
  ],
  'Sivas': [
    'Akıncılar', 'Altınyayla', 'Divriği', 'Doğanşar', 'Gemerek', 'Gölova', 'Hafik',
    'İmranlı', 'Kangal', 'Koyulhisar', 'Merkez', 'Suşehri', 'Şarkışla', 'Ulaş',
    'Yıldızeli', 'Zara'
  ],
  'Tekirdağ': [
    'Çerkezköy', 'Çorlu', 'Ergene', 'Hayrabolu', 'Kapaklı', 'Malkara', 'Marmaraereğlisi',
    'Muratlı', 'Saray', 'Süleymanpaşa', 'Şarköy'
  ],
  'Tokat': [
    'Almus', 'Artova', 'Başçiftlik', 'Erbaa', 'Merkez', 'Niksar', 'Pazar', 'Reşadiye',
    'Sulusaray', 'Turhal', 'Yeşilyurt', 'Zile'
  ],
  'Trabzon': [
    'Akçaabat', 'Araklı', 'Arsin', 'Beşikdüzü', 'Çarşıbaşı', 'Çaykara', 'Dernekpazarı',
    'Düzköy', 'Hayrat', 'Köprübaşı', 'Maçka', 'Of', 'Ortahisar', 'Sürmene', 'Şalpazarı',
    'Tonya', 'Vakfıkebir', 'Yomra'
  ],
  'Tunceli': [
    'Çemişgezek', 'Hozat', 'Mazgirt', 'Merkez', 'Nazımiye', 'Ovacık', 'Pertek', 'Pülümür'
  ],
  'Şanlıurfa': [
    'Akçakale', 'Birecik', 'Bozova', 'Ceylanpınar', 'Eyyübiye', 'Halfeti',
    'Haliliye', 'Harran', 'Hilvan', 'Karaköprü', 'Siverek', 'Suruç', 'Viranşehir'
  ],
  'Uşak': [
    'Banaz', 'Eşme', 'Karahallı', 'Merkez', 'Sivaslı', 'Ulubey'
  ],
  'Van': [
    'Bahçesaray', 'Başkale', 'Çaldıran', 'Çatak', 'Edremit', 'Erciş', 'Gevaş',
    'Gürpınar', 'İpekyolu', 'Muradiye', 'Özalp', 'Saray', 'Tuşba'
  ],
  'Yozgat': [
    'Akdağmadeni', 'Aydıncık', 'Boğazlıyan', 'Çandır', 'Çayıralan', 'Çekerek',
    'Kadışehri', 'Merkez', 'Saraykent', 'Sarıkaya', 'Şefaatli', 'Sorgun',
    'Yenifakılı', 'Yerköy'
  ],
  'Zonguldak': [
    'Alaplı', 'Çaycuma', 'Devrek', 'Ereğli', 'Gökçebey', 'Kilimli', 'Kozlu', 'Merkez'
  ],
  'Aksaray': [
    'Ağaçören', 'Eskil', 'Gülağaç', 'Güzelyurt', 'Merkez', 'Ortaköy', 'Sarıyahşi',
    'Sultanhanı'
  ],
  'Bayburt': [
    'Aydıntepe', 'Demirözü', 'Merkez'
  ],
  'Karaman': [
    'Ayrancı', 'Başyayla', 'Ermenek', 'Kazımkarabekir', 'Merkez', 'Sarıveliler'
  ],
  'Kırıkkale': [
    'Bahşılı', 'Balışeyh', 'Çelebi', 'Delice', 'Karakeçili', 'Keskin', 'Merkez',
    'Sulakyurt', 'Yahşihan'
  ],
  'Batman': [
    'Beşiri', 'Gercüş', 'Hasankeyf', 'Kozluk', 'Merkez', 'Sason'
  ],
  'Şırnak': [
    'Beytüşşebap', 'Cizre', 'Güçlükonak', 'İdil', 'Merkez', 'Silopi', 'Uludere'
  ],
  'Bartın': [
    'Amasra', 'Kurucaşile', 'Merkez', 'Ulus'
  ],
  'Ardahan': [
    'Çıldır', 'Damal', 'Göle', 'Hanak', 'Merkez', 'Posof'
  ],
  'Iğdır': [
    'Aralık', 'Karakoyunlu', 'Merkez', 'Tuzluca'
  ],
  'Yalova': [
    'Altınova', 'Armutlu', 'Çınarcık', 'Çiftlikköy', 'Merkez', 'Termal'
  ],
  'Karabük': [
    'Eflani', 'Eskipazar', 'Merkez', 'Ovacık', 'Safranbolu', 'Yenice'
  ],
  'Kilis': [
    'Elbeyli', 'Merkez', 'Musabeyli', 'Polateli'
  ],
  'Osmaniye': [
    'Bahçe', 'Düziçi', 'Hasanbeyli', 'Kadirli', 'Merkez', 'Sumbas', 'Toprakkale'
  ],
  'Düzce': [
    'Akçakoca', 'Çilimli', 'Cumayeri', 'Gölyaka', 'Gümüşova', 'Kaynaşlı', 'Merkez',
    'Yığılca'
  ]
}); 