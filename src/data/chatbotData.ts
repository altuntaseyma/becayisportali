export interface ChatbotMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface ChatbotCategory {
  id: string;
  title: string;
  questions: {
    id: string;
    question: string;
    answer: string;
  }[];
}

export const chatbotCategories: ChatbotCategory[] = [
  {
    id: 'selamlasma',
    title: 'Selamlaşma ve Genel Sohbet',
    questions: [
      {
        id: 'selam-1',
        question: 'merhaba',
        answer: 'Merhaba! Size nasıl yardımcı olabilirim?'
      },
      {
        id: 'selam-2',
        question: 'selam',
        answer: 'Selam! Becayiş ve memuriyet konularında sorularınızı yanıtlamaya hazırım.'
      },
      {
        id: 'selam-3',
        question: 'nasılsın',
        answer: 'İyiyim, teşekkür ederim. Siz nasılsınız? Becayiş ve memuriyet konularında yardıma ihtiyacınız var mı?'
      },
      {
        id: 'selam-4',
        question: 'günaydın',
        answer: 'Günaydın! Size nasıl yardımcı olabilirim?'
      },
      {
        id: 'selam-5',
        question: 'iyi günler',
        answer: 'İyi günler! Becayiş ve memuriyet konularında sorularınızı yanıtlamaktan mutluluk duyarım.'
      },
      {
        id: 'selam-6',
        question: 'iyi akşamlar',
        answer: 'İyi akşamlar! Size nasıl yardımcı olabilirim?'
      },
      {
        id: 'selam-7',
        question: 'teşekkür ederim',
        answer: 'Rica ederim! Başka sorunuz varsa yardımcı olmaktan mutluluk duyarım.'
      },
      {
        id: 'selam-8',
        question: 'hoşça kal',
        answer: 'Hoşça kalın! İyi günler dilerim.'
      }
    ]
  },
  {
    id: 'genel-bilgi',
    title: 'Genel Bilgi',
    questions: [
      {
        id: 'genel-1',
        question: '657 sayılı Devlet Memurları Kanunu nedir?',
        answer: '657 sayılı Devlet Memurları Kanunu, Türkiye\'de kamu görevlilerinin statüsünü, haklarını, ödevlerini ve sorumluluklarını düzenleyen temel kanundur. Bu kanun, devlet memurlarının atanması, yükselmesi, nakli, emekliliği ve diğer tüm özlük haklarını kapsar.'
      },
      {
        id: 'genel-2',
        question: 'Kimler 657\'ye tabi memur sayılır?',
        answer: '657 sayılı kanuna tabi memurlar: 1) Devlet kurumlarında çalışan kadrolu memurlar, 2) Kamu kurum ve kuruluşlarında istihdam edilen sürekli statüdeki personel, 3) Belediye ve il özel idarelerinde çalışan kadrolu personel, 4) Üniversitelerde çalışan akademik ve idari personel'
      },
      {
        id: 'genel-3',
        question: '657 sayılı kanuna göre memurların görev ve sorumlulukları nelerdir?',
        answer: 'Memurların temel görev ve sorumlulukları: 1) Kanunlara ve yönetmeliklere uymak, 2) Görevlerini dürüstlük ve tarafsızlık içinde yapmak, 3) Devlet sırlarını korumak, 4) Görev süresince ve sonrasında gizliliği korumak, 5) Görevlerini zamanında ve eksiksiz yapmak, 6) Amirlerine karşı saygılı olmak'
      },
      {
        id: 'genel-4',
        question: 'Devlet memuriyetine giriş şartları nelerdir?',
        answer: 'Devlet memuriyetine giriş şartları: 1) Türkiye Cumhuriyeti vatandaşı olmak, 2) 18 yaşını doldurmuş olmak, 3) KPSS\'den yeterli puan almak, 4) Sağlık durumunun uygun olması, 5) Güvenlik soruşturmasından geçmek, 6) Yükümlü olduğu askerlik hizmetini tamamlamış olmak'
      },
      {
        id: 'genel-5',
        question: 'Memur kadroları nasıl belirlenir?',
        answer: 'Memur kadroları, kurumların ihtiyaçları doğrultusunda Devlet Personel Başkanlığı tarafından belirlenir. Kadrolar, kurumların teklifi ve Maliye Bakanlığı\'nın onayı ile oluşturulur ve güncellenir.'
      },
      {
        id: 'genel-6',
        question: 'Memurlukta deneme süresi kaç aydır?',
        answer: 'Memurlukta deneme süresi 1 yıldır. Bu süre içinde memurun görevi ile ilgili yeterliliği değerlendirilir. Deneme süresi sonunda başarılı görülen memur kadrolu memur statüsüne geçer.'
      },
      {
        id: 'genel-7',
        question: 'Sözleşmeli personel ile kadrolu memur arasındaki fark nedir?',
        answer: 'Kadrolu memurlar 657 sayılı kanuna tabi olup, sürekli statüde çalışırlar. Sözleşmeli personel ise belirli süreli sözleşmelerle çalışır ve bazı özlük haklarından farklı şekilde yararlanır. Kadrolu memurlar daha fazla güvenceye sahiptir.'
      }
    ]
  },
  {
    id: 'becayis-temel',
    title: 'Becayiş Temel Bilgiler',
    questions: [
      {
        id: 'becayis-1',
        question: 'Becayiş nedir?',
        answer: 'Becayiş, iki memurun karşılıklı olarak yer değiştirmesi işlemidir. Bu işlem, memurların aynı unvan ve sınıfta olması şartıyla gerçekleştirilir. Becayiş, memurların kendi istekleri doğrultusunda ve kurumların onayıyla yapılır.'
      },
      {
        id: 'becayis-2',
        question: 'Kimler becayiş yapabilir?',
        answer: 'Becayiş yapabilmek için: 1) Aynı unvan ve sınıfta olmak, 2) En az 3 yıl görev yapmış olmak, 3) Disiplin cezası almamış olmak, 4) Sağlık durumunun uygun olması gerekir.'
      },
      {
        id: 'becayis-3',
        question: 'Becayiş için hangi şartlar gerekir?',
        answer: 'Becayiş için gerekli şartlar: 1) Aynı unvan ve sınıfta olmak, 2) En az 3 yıl görev yapmış olmak, 3) Disiplin cezası almamış olmak, 4) Sağlık durumunun uygun olması, 5) Her iki kurumun da onay vermesi, 6) Boş kadro bulunması'
      }
    ]
  },
  {
    id: 'becayis-basvuru',
    title: 'Becayiş Başvuru Süreci',
    questions: [
      {
        id: 'basvuru-1',
        question: 'Becayiş başvurusu nereye yapılır?',
        answer: 'Becayiş başvurusu, memurun bağlı olduğu kurumun personel dairesine yapılır. Başvuru sırasında gerekli belgeler ve becayiş talebi dilekçesi sunulmalıdır.'
      },
      {
        id: 'basvuru-2',
        question: 'Becayişte hangi belgeler gereklidir?',
        answer: 'Becayiş için gerekli belgeler: 1) Becayiş talep formu, 2) Mevcut görev yeri belgesi, 3) Sicil dosyası, 4) Sağlık raporu, 5) Disiplin cezası olmadığına dair belge, 6) Kimlik fotokopisi, 7) Vesikalık fotoğraf'
      },
      {
        id: 'basvuru-3',
        question: 'Becayiş dilekçesi nasıl yazılır?',
        answer: 'Becayiş dilekçesi şu bilgileri içermelidir: 1) Memurun adı, soyadı ve sicil numarası, 2) Mevcut görev yeri ve unvanı, 3) Becayiş yapmak istediği memurun bilgileri, 4) Becayiş yapmak istediği kurum ve görev yeri, 5) Becayiş talebinin gerekçesi'
      }
    ]
  },
  {
    id: 'becayis-ozel-durumlar',
    title: 'Özel Durumlar',
    questions: [
      {
        id: 'ozel-1',
        question: 'Sağlık Bakanlığı çalışanları becayiş yapabilir mi?',
        answer: 'Evet, Sağlık Bakanlığı çalışanları da diğer memurlar gibi becayiş yapabilir. Ancak aynı unvan ve sınıfta olma şartı aranır. Örneğin, hemşireler hemşirelerle, doktorlar doktorlarla becayiş yapabilir.'
      },
      {
        id: 'ozel-2',
        question: 'Aynı kurumda farklı unvanda olan memurlar becayiş yapabilir mi?',
        answer: 'Hayır, becayiş için memurların aynı unvan ve sınıfta olması şarttır. Farklı unvanlardaki memurlar becayiş yapamaz.'
      },
      {
        id: 'ozel-3',
        question: 'Aynı kurumda çalışan eşler becayiş yapabilir mi?',
        answer: 'Evet, aynı kurumda çalışan eşler, eğer aynı unvan ve sınıfta iseler becayiş yapabilirler. Ancak kurumun onayı gerekir.'
      },
      {
        id: 'ozel-4',
        question: 'İl içi becayiş mümkün mü?',
        answer: 'Evet, il içi becayiş mümkündür. Aynı il içindeki farklı kurumlarda çalışan memurlar, gerekli şartları sağladıkları takdirde becayiş yapabilirler.'
      }
    ]
  },
  {
    id: 'becayis-haklar',
    title: 'Becayiş Hakları ve İtiraz',
    questions: [
      {
        id: 'haklar-1',
        question: 'Becayiş talebim reddedilirse ne yapabilirim?',
        answer: 'Becayiş talebi reddedilirse: 1) Red gerekçesini öğrenme hakkınız var, 2) Üst makama itiraz edebilirsiniz, 3) İdari yargı yoluna başvurabilirsiniz. Red gerekçesi hukuka aykırı ise dava açabilirsiniz.'
      },
      {
        id: 'haklar-2',
        question: 'Becayiş için idarenin onayı şart mı?',
        answer: 'Evet, becayiş işleminin gerçekleşmesi için her iki kurumun da onayı şarttır. Kurumlar, hizmet gerekleri ve personel durumunu değerlendirerek onay verebilir veya reddedebilir.'
      },
      {
        id: 'haklar-3',
        question: 'Becayiş süreci ortalama ne kadar sürer?',
        answer: 'Becayiş süreci genellikle 1-3 ay arasında tamamlanır. Bu süre, kurumların iş yükü, belge kontrolü ve onay süreçlerine göre değişebilir. Acil durumlarda süre kısalabilir.'
      }
    ]
  },
  {
    id: 'becayis-yonetmelik',
    title: 'Yönetmelik ve Mevzuat',
    questions: [
      {
        id: 'yonetmelik-1',
        question: 'Becayiş için yönetmelik maddesi hangisidir?',
        answer: 'Becayiş işlemleri 657 sayılı Devlet Memurları Kanunu\'nun 72. maddesi ve ilgili yönetmeliklerle düzenlenmiştir. Bu maddeler, becayiş şartlarını, süreçlerini ve haklarını belirler.'
      },
      {
        id: 'yonetmelik-2',
        question: 'Becayiş iptal edilir mi?',
        answer: 'Evet, becayiş işlemi belirli durumlarda iptal edilebilir: 1) Memurlardan birinin vazgeçmesi durumunda, 2) Kurumların gerekli görmesi halinde, 3) Hukuki bir engel çıkması durumunda. İptal durumunda memurlar eski görevlerine döner.'
      }
    ]
  },
  {
    id: 'becayis-kurumlar',
    title: 'Kurumlar Arası Becayiş',
    questions: [
      {
        id: 'kurumlar-1',
        question: 'Kurumlar arası becayiş mümkün mü?',
        answer: 'Evet, farklı kurumlar arasında becayiş mümkündür. Ancak memurların aynı unvan ve sınıfta olması şarttır. Her iki kurumun da onayı gerekir.'
      },
      {
        id: 'kurumlar-2',
        question: 'Aynı şehirdeki farklı kurumlarda çalışan memurlar becayiş yapabilir mi?',
        answer: 'Evet, aynı şehirdeki farklı kurumlarda çalışan memurlar, gerekli şartları sağladıkları takdirde becayiş yapabilirler. Kurumların onayı ve boş kadro bulunması şarttır.'
      }
    ]
  },
  {
    id: 'becayis-ozel-haller',
    title: 'Özel Haller',
    questions: [
      {
        id: 'ozel-haller-1',
        question: 'Disiplin cezası olan biri becayiş yapabilir mi?',
        answer: 'Hayır, disiplin cezası olan memurlar becayiş yapamaz. Disiplin cezasının kesinleşmiş olması ve sicil dosyasında yer alması durumunda becayiş talebi reddedilir.'
      },
      {
        id: 'ozel-haller-2',
        question: 'Zorunlu hizmet bölgesindeki memur becayiş yapabilir mi?',
        answer: 'Zorunlu hizmet bölgesindeki memurlar, zorunlu hizmet sürelerini tamamlamadan becayiş yapamazlar. Ancak özel durumlar (sağlık özrü, aile birliği gibi) değerlendirilebilir.'
      }
    ]
  },
  {
    id: 'tayin',
    title: 'Tayin ve Yer Değişikliği',
    questions: [
      {
        id: 'tayin-1',
        question: '657\'ye tabi memurlar tayin isteğinde bulunabilir mi?',
        answer: 'Evet, 657\'ye tabi memurlar belirli şartları sağladıklarında tayin isteğinde bulunabilirler. Bu şartlar: 1) En az 3 yıl görev yapmış olmak, 2) Disiplin cezası almamış olmak, 3) Sağlık durumunun uygun olması, 4) Hedef kurumda boş kadro bulunması'
      },
      {
        id: 'tayin-2',
        question: 'Tayin isteme hakkı hangi süreden sonra doğar?',
        answer: 'Tayin isteme hakkı, memurun göreve başladığı tarihten itibaren 3 yıl sonra doğar. Ancak bazı özel durumlarda (sağlık özrü, aile birliği gibi) bu süre beklenmeden tayin istenebilir.'
      },
      {
        id: 'tayin-3',
        question: 'Zorunlu hizmet bölgesine atanan biri tayin isteyebilir mi?',
        answer: 'Zorunlu hizmet bölgesine atanan memurlar, zorunlu hizmet sürelerini tamamlamadan tayin isteğinde bulunamazlar. Ancak özel durumlar (sağlık özrü, aile birliği gibi) değerlendirilebilir.'
      },
      {
        id: 'tayin-4',
        question: 'Hizmet puanı tayinlerde nasıl etkili olur?',
        answer: 'Hizmet puanı, memurun görev süresi, eğitim durumu, aile durumu gibi faktörlere göre hesaplanır. Yüksek hizmet puanı, tayin taleplerinde öncelik sağlar.'
      }
    ]
  },
  {
    id: 'aile-birligi',
    title: 'Aile Birliği ve Özel Durumlar',
    questions: [
      {
        id: 'aile-1',
        question: 'Aile birliği mazereti ile tayin yapılır mı?',
        answer: 'Evet, aile birliği mazereti ile tayin yapılabilir. Eşlerin ayrı şehirlerde çalışması durumunda, aile birliğini sağlamak amacıyla tayin talebinde bulunulabilir.'
      },
      {
        id: 'aile-2',
        question: 'Eşim özel sektörde çalışıyor, aile birliği tayini alabilir miyim?',
        answer: 'Evet, eşiniz özel sektörde çalışsa bile aile birliği tayini talep edebilirsiniz. Ancak eşinizin çalıştığı yerin belgelendirilmesi gerekir.'
      },
      {
        id: 'aile-3',
        question: 'Eşim asker, aile birliği tayini hakkım var mı?',
        answer: 'Evet, eşiniz asker olsa bile aile birliği tayini talep edebilirsiniz. Askeri personelin görev yeri belgesi ile başvuru yapabilirsiniz.'
      }
    ]
  },
  {
    id: 'saglik-ozru',
    title: 'Sağlık Özrü ve Özel Durumlar',
    questions: [
      {
        id: 'saglik-1',
        question: 'Sağlık özrü nedeniyle tayin hakkım var mı?',
        answer: 'Evet, sağlık özrü nedeniyle tayin talep edebilirsiniz. Bunun için sağlık kurulu raporu almanız ve raporun tayin için uygun görülmesi gerekir.'
      },
      {
        id: 'saglik-2',
        question: 'Hangi hastalıklar sağlık özrü sayılır?',
        answer: 'Sağlık özrü sayılan hastalıklar: 1) Kronik hastalıklar, 2) İklim koşullarına uyumsuzluk, 3) Tedavi gerektiren hastalıklar, 4) Engellilik durumları. Bu durumlar sağlık kurulu tarafından değerlendirilir.'
      },
      {
        id: 'saglik-3',
        question: 'Sağlık özrü tayinleri yılda kaç kez yapılır?',
        answer: 'Sağlık özrü tayinleri genellikle yılda 2 kez yapılır. Ancak acil durumlarda daha sık değerlendirilebilir.'
      }
    ]
  },
  {
    id: 'disiplin',
    title: 'Disiplin ve Soruşturma',
    questions: [
      {
        id: 'disiplin-1',
        question: 'Devlet memuruna disiplin cezası nasıl verilir?',
        answer: 'Disiplin cezası verme süreci: 1) Soruşturma açılması, 2) Savunma alınması, 3) Disiplin kurulunun kararı, 4) İdarenin onayı şeklinde ilerler. Disiplin cezaları: uyarı, kınama, aylıktan kesme, kademe ilerlemesinin durdurulması ve memuriyetten çıkarma şeklinde olabilir.'
      },
      {
        id: 'disiplin-2',
        question: 'Hakkımda disiplin soruşturması açıldı, tayin isteyebilir miyim?',
        answer: 'Disiplin soruşturması devam ederken tayin talebinde bulunabilirsiniz, ancak soruşturma sonucuna göre tayin talebiniz değerlendirilir. Disiplin cezası almanız durumunda tayin talebiniz reddedilebilir.'
      },
      {
        id: 'disiplin-3',
        question: 'Disiplin cezası sicil dosyasından ne zaman silinir?',
        answer: 'Disiplin cezaları, cezanın türüne göre farklı sürelerde sicil dosyasından silinir. Uyarı ve kınama cezaları 5 yıl, aylıktan kesme cezası 10 yıl sonra silinir.'
      }
    ]
  },
  {
    id: 'izin-haklari',
    title: 'İzin ve Tatil Hakları',
    questions: [
      {
        id: 'izin-1',
        question: 'Memurlar yıllık izinlerini nasıl kullanır?',
        answer: 'Memurlar yıllık izinlerini: 1) En az 1, en fazla 3 aylık dilimler halinde, 2) Kurumun hizmet gereklerine göre, 3) Genellikle yaz aylarında kullanabilirler. Yıllık izin süresi, hizmet süresine göre 20-30 gün arasında değişir.'
      },
      {
        id: 'izin-2',
        question: 'Yeni başlayan bir memur ne kadar yıllık izin hakkına sahiptir?',
        answer: 'Yeni başlayan bir memur ilk yıl 20 gün yıllık izin hakkına sahiptir. Bu süre, hizmet süresinin artmasına bağlı olarak 30 güne kadar çıkabilir.'
      },
      {
        id: 'izin-3',
        question: 'Hastalık izni süresi ne kadardır?',
        answer: 'Hastalık izni, hastalığın türüne ve durumuna göre değişir. Genellikle 6 aya kadar verilebilir. Bu süre, sağlık kurulu raporu ile uzatılabilir.'
      }
    ]
  },
  {
    id: 'maas-ozluk',
    title: 'Maaş ve Özlük Hakları',
    questions: [
      {
        id: 'maas-1',
        question: 'Devlet memuru maaşı nasıl hesaplanır?',
        answer: 'Memur maaşı şu unsurlardan oluşur: 1) Gösterge tabanı, 2) Ek gösterge, 3) Taban aylık, 4) Kıdem aylığı, 5) Görev tazminatı, 6) Özel hizmet tazminatı (varsa)'
      },
      {
        id: 'maas-2',
        question: 'Ek gösterge nedir, kimleri kapsar?',
        answer: 'Ek gösterge, memurun eğitim durumu ve unvanına göre belirlenen bir katsayıdır. Yüksek lisans ve doktora yapanlar, yönetici konumundakiler daha yüksek ek gösterge alır.'
      },
      {
        id: 'maas-3',
        question: 'Derece ve kademe nasıl ilerler?',
        answer: 'Derece ilerlemesi, memurun eğitim durumuna göre belirlenir. Kademe ilerlemesi ise her 3 yılda bir otomatik olarak gerçekleşir. Disiplin cezası alınması durumunda kademe ilerlemesi durdurulabilir.'
      }
    ]
  },
  {
    id: 'teknik-prosedur',
    title: 'Teknik ve Prosedür Detayları',
    questions: [
      {
        id: 'teknik-1',
        question: 'Becayiş işleminde hangi formlar doldurulur?',
        answer: 'Becayiş başvuru formu, personel bilgi formu, sicil özet formu ve kuruma özel ek formlar doldurulur.'
      },
      {
        id: 'teknik-2',
        question: 'Becayiş için sağlık raporu hangi dallardan alınmalı?',
        answer: 'Genel dahiliye, göğüs hastalıkları, ruh sağlığı, göz ve kulak burun boğaz muayeneleri zorunludur.'
      },
      {
        id: 'teknik-3',
        question: 'Becayiş başvurusunda fotoğraf şartları neler?',
        answer: '4x6 cm boyutunda, son 6 ay içinde çekilmiş, beyaz zemin üzerine renkli vesikalık fotoğraf gereklidir.'
      },
      {
        id: 'teknik-4',
        question: 'Becayiş dilekçesinde gerekçe nasıl yazılır?',
        answer: 'Objektif ve makul gerekçeler yazılmalı. Kişisel, sağlık, aile durumu gibi geçerli sebepler belirtilmelidir.'
      }
    ]
  },
  {
    id: 'farkli-kurumlar',
    title: 'Farklı Kurum ve Statüler',
    questions: [
      {
        id: 'kurum-1',
        question: 'Belediye personeli becayiş yapabilir mi?',
        answer: 'Evet, aynı belediye içinde veya farklı belediyeler arasında becayiş yapabilir. Belediye başkanının onayı gerekir.'
      },
      {
        id: 'kurum-2',
        question: 'Üniversite personeli becayiş şartları neler?',
        answer: 'Aynı üniversite içinde fakülte/birim değişikliği veya farklı üniversiteler arası becayiş mümkündür. Rektör onayı gerekir.'
      },
      {
        id: 'kurum-3',
        question: 'Askeri personel becayiş yapabilir mi?',
        answer: 'Askeri personel için özel düzenlemeler vardır. Genelkurmay ve ilgili kuvvet komutanlıklarının onayı gereklidir.'
      },
      {
        id: 'kurum-4',
        question: 'İl özel idaresi personeli becayiş yapabilir mi?',
        answer: 'Evet, il özel idaresi personeli becayiş yapabilir. Vali onayı ve il genel meclisi kararı gerekebilir.'
      }
    ]
  },
  {
    id: 'becayis-engelleri',
    title: 'Becayiş Engelleri ve Çözümler',
    questions: [
      {
        id: 'engel-1',
        question: 'Becayiş başvurusu neden reddedilir?',
        answer: 'Hizmet gerekleri, personel ihtiyacı, disiplin cezası, sağlık durumu uygunsuzluğu veya belge eksikliği nedeniyle reddedilebilir.'
      },
      {
        id: 'engel-2',
        question: 'Personel açığı olan yerde çalışan becayiş yapabilir mi?',
        answer: 'Kritik personel açığı olan birimlerde çalışanların becayişi genellikle reddedilir veya ertelenir.'
      },
      {
        id: 'engel-3',
        question: 'Proje görevinde olan memur becayiş yapabilir mi?',
        answer: 'Devam eden önemli projelerde görevli personelin becayişi proje bitene kadar ertelenebilir.'
      },
      {
        id: 'engel-4',
        question: 'Becayiş için alternatif çözümler neler?',
        answer: 'Nakil, görevlendirme, geçici görev, rotasyon veya terfi yoluyla yer değişikliği alternatifleri vardır.'
      }
    ]
  },
  {
    id: 'yasal-haklar',
    title: 'Yasal Haklar ve Sorumluluklar',
    questions: [
      {
        id: 'yasal-1',
        question: 'Becayiş hakkında bilgi alma hakkı var mı?',
        answer: 'Evet, başvuru durumu ve süreç hakkında bilgi alma hakkınız vardır. Dilekçe ile başvurabilirsiniz.'
      },
      {
        id: 'yasal-2',
        question: 'Becayiş başvurusu ret gerekçesi öğrenilebilir mi?',
        answer: 'Evet, ret gerekçesini öğrenme hakkınız vardır. Yazılı olarak gerekçe talep edilebilir.'
      },
      {
        id: 'yasal-3',
        question: 'Becayiş için başvuru ücreti var mı?',
        answer: 'Resmi başvuru ücreti yoktur. Sadece belge temin masrafları personel tarafından karşılanır.'
      },
      {
        id: 'yasal-4',
        question: 'Becayiş sonrası görev yeri değişirse ne olur?',
        answer: 'Atama emri kesinleştikten sonra tek taraflı değişiklik yapılamaz. Her iki tarafın onayı gerekir.'
      }
    ]
  },
  {
    id: 'uyum-sureci',
    title: 'Becayiş Sonrası Uyum',
    questions: [
      {
        id: 'uyum-1',
        question: 'Yeni görev yerinde oryantasyon var mı?',
        answer: 'Kuruma göre değişir. Çoğu kurum yeni gelen personel için oryantasyon programı düzenler.'
      },
      {
        id: 'uyum-2',
        question: 'Becayiş sonrası performans değerlendirmesi nasıl olur?',
        answer: 'Normal performans değerlendirme süreçleri uygulanır. Önceki performans notları dikkate alınır.'
      },
      {
        id: 'uyum-3',
        question: 'Becayiş yapan memur eğitim alabilir mi?',
        answer: 'Evet, yeni görev yerine uyum için gerekli eğitimler verilir veya kurslara gönderilir.'
      },
      {
        id: 'uyum-4',
        question: 'Becayiş sonrası işyeri arkadaşlığı nasıl kurulur?',
        answer: 'Açık iletişim kurarak, kurumsal etkinliklere katılarak ve meslek dayanışması göstererek uyum sağlanır.'
      }
    ]
  },
  {
    id: 'ozel-durumlar',
    title: 'Özel Durumlar ve İstisnalar',
    questions: [
      {
        id: 'ozel-1',
        question: 'Hamile memur becayiş yapabilir mi?',
        answer: 'Yapabilir, ancak sağlık durumu ve doğum izni planlaması dikkate alınır. Sağlık raporu güncel olmalıdır.'
      },
      {
        id: 'ozel-2',
        question: 'Kronik hastası olan memur becayiş şartları neler?',
        answer: 'Tedavi imkanları, hastane varlığı ve sağlık durumunun yeni görev yerine uygunluğu değerlendirilir.'
      },
      {
        id: 'ozel-3',
        question: 'Engelli memur becayiş kolaylığı var mı?',
        answer: 'Evet, özür grubu memurlar için kolaylık sağlanır. Erişebilirlik ve uygun çalışma ortamı kontrol edilir.'
      },
      {
        id: 'ozel-4',
        question: 'Eşi hasta olan memur becayiş yapabilir mi?',
        answer: 'Eşin tedavi ihtiyaçları gerekçe gösterilerek becayiş başvurusu yapılabilir. Sağlık raporu eklenir.'
      }
    ]
  },
  {
    id: 'teknolojik-surec',
    title: 'Teknolojik Süreçler',
    questions: [
      {
        id: 'teknoloji-1',
        question: 'Becayiş başvurusu online yapılabilir mi?',
        answer: 'Bazı kurumlar e-devlet veya kendi sistemleri üzerinden online başvuru imkanı sunmaktadır.'
      },
      {
        id: 'teknoloji-2',
        question: 'Becayiş durumu SMS ile takip edilebilir mi?',
        answer: 'Kuruma göre değişir. Bazı kurumlar SMS bilgilendirme hizmeti vermektedir.'
      },
      {
        id: 'teknoloji-3',
        question: 'Becayiş için gerekli belgeler dijital olarak gönderilebilir mi?',
        answer: 'Pandemi döneminde dijital belge kabul edilmeye başlandı. Kurumun dijital dönüşüm seviyesine bağlıdır.'
      },
      {
        id: 'teknoloji-4',
        question: 'E-imza ile becayiş başvurusu yapılabilir mi?',
        answer: 'E-imza altyapısı olan kurumlarda e-imza ile başvuru yapılabilir.'
      }
    ]
  },
  {
    id: 'maddi-konular',
    title: 'Maddi Konular',
    questions: [
      {
        id: 'maddi-1',
        question: 'Becayiş masrafları ne kadardır?',
        answer: 'Evrak masrafları, sağlık raporu ücreti, fotoğraf ve ulaşım giderleri yaklaşık 200-500 TL arasındadır.'
      },
      {
        id: 'maddi-2',
        question: 'Becayiş için taşınma yardımı var mı?',
        answer: 'Resmi taşınma yardımı yoktur. Ancak bazı kurumlar sosyal yardım fonu ile destek verebilir.'
      },
      {
        id: 'maddi-3',
        question: 'Becayiş yapan memura avans verilir mi?',
        answer: 'Normal personel avans kuralları geçerlidir. Taşınma için ek avans genellikle verilmez.'
      },
      {
        id: 'maddi-4',
        question: 'Becayiş sonrası maaş farkı olur mu?',
        answer: 'Aynı derece olduğu için maaş farkı olmaz. Ancak yerel ek ödemeler değişebilir.'
      }
    ]
  },
  {
    id: 'zaman-planlama',
    title: 'Zaman Planlaması',
    questions: [
      {
        id: 'zaman-1',
        question: 'Becayiş için en uygun ay hangisidir?',
        answer: 'Eylül-Kasım arası başvurular daha hızlı değerlendirilir. Yaz ayları komisyon tatili nedeniyle yavaştır.'
      },
      {
        id: 'zaman-2',
        question: 'Becayiş başvurusu kaç ay önceden yapılmalı?',
        answer: 'İstenilen tarihin en az 6 ay öncesinden başvuru yapılması önerilir.'
      },
      {
        id: 'zaman-3',
        question: 'Becayiş için acil başvuru var mı?',
        answer: 'Sağlık, aile acil durumları için hızlandırılmış değerlendirme yapılabilir.'
      },
      {
        id: 'zaman-4',
        question: 'Yıl sonu becayiş başvuruları değerlendirilir mi?',
        answer: 'Aralık ayında başvurular alınır ancak değerlendirme yeni yıl başında yapılır.'
      }
    ]
  }
]; 