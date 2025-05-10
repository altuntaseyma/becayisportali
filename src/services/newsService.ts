import axios from 'axios';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string;
  date: string;
  imageUrl?: string;
}

export const categories = [
  'Memur Maaşları',
  'Memur Atamaları',
  'Memur Hakları',
  'Memur Sınavları',
  'Memur Emeklilik',
  'Memur Sendikaları',
  'Genel Memur Haberleri'
];

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2';

const testNews: NewsItem[] = [
  {
    id: '1',
    title: '2024 Memur Maaş Zam Oranı Açıklandı',
    content: '2024 yılı için memur maaş zam oranı %15 olarak belirlendi. Bu zam oranı, enflasyon ve ekonomik göstergeler dikkate alınarak belirlendi. Memurların yeni maaşları 1 Temmuz\'dan itibaren ödenmeye başlayacak.',
    category: 'Memur Maaşları',
    source: 'Resmi Gazete',
    date: '2024-03-20',
    imageUrl: 'https://picsum.photos/800/400'
  },
  {
    id: '2',
    title: 'Yeni Memur Atamaları Başladı',
    content: 'Kamu kurumlarına yeni memur atamaları başladı. Toplam 10 bin memur alımı yapılacak. Başvurular 1 Nisan\'da başlayacak ve 15 Nisan\'da sona erecek.',
    category: 'Memur Atamaları',
    source: 'Memurlar.net',
    date: '2024-03-19',
    imageUrl: 'https://picsum.photos/800/401'
  },
  {
    id: '3',
    title: 'Memur Sendikaları Zam Oranını Yetersiz Buldu',
    content: 'Memur sendikaları, açıklanan %15\'lik zam oranını yetersiz buldu ve yeni bir müzakere süreci başlatılmasını talep etti. Sendikalar en az %25 zam istiyor.',
    category: 'Memur Sendikaları',
    source: 'Sendika Haberleri',
    date: '2024-03-18',
    imageUrl: 'https://picsum.photos/800/402'
  },
  {
    id: '4',
    title: 'Memurlara Yeni İzin Hakları',
    content: 'Memurlara yeni izin hakları tanımlandı. Doğum izni 6 aya çıkarıldı, evlilik izni 10 güne çıkarıldı. Ayrıca yıllık izin süreleri de artırıldı.',
    category: 'Memur Hakları',
    source: 'Kamu Haberleri',
    date: '2024-03-17',
    imageUrl: 'https://picsum.photos/800/403'
  },
  {
    id: '5',
    title: 'KPSS Sınav Tarihleri Açıklandı',
    content: '2024 KPSS sınav tarihleri açıklandı. Lisans düzeyi sınavı 7 Temmuz\'da, ön lisans düzeyi sınavı 14 Temmuz\'da yapılacak.',
    category: 'Memur Sınavları',
    source: 'ÖSYM',
    date: '2024-03-16',
    imageUrl: 'https://picsum.photos/800/404'
  },
  {
    id: '6',
    title: 'Emekli Memur Maaşları Güncellendi',
    content: 'Emekli memur maaşları güncellendi. Emekli memurların maaşlarına %12.5 zam yapıldı. Yeni maaşlar 1 Nisan\'dan itibaren ödenecek.',
    category: 'Memur Emeklilik',
    source: 'Emekli Haberleri',
    date: '2024-03-15',
    imageUrl: 'https://picsum.photos/800/405'
  },
  {
    id: '7',
    title: 'Memur Maaşlarına Ek Ödeme',
    content: 'Memur maaşlarına ek ödeme yapılacak. Her memura 3 bin TL ek ödeme yapılması planlanıyor. Ödemeler Mayıs ayında yapılacak.',
    category: 'Memur Maaşları',
    source: 'Ekonomi Haberleri',
    date: '2024-03-14',
    imageUrl: 'https://picsum.photos/800/406'
  },
  {
    id: '8',
    title: 'Sağlık Memurlarına Özel İzin',
    content: 'Sağlık memurlarına özel izin hakkı tanımlandı. Pandemi sürecinde çalışan sağlık memurlarına 10 gün ek izin verilecek.',
    category: 'Memur Hakları',
    source: 'Sağlık Haberleri',
    date: '2024-03-13',
    imageUrl: 'https://picsum.photos/800/407'
  },
  {
    id: '9',
    title: 'Memur Sendikaları Birleşiyor',
    content: 'İki büyük memur sendikası birleşme kararı aldı. Birleşme sonrası yeni sendikanın adı "Türkiye Memur Sendikaları Konfederasyonu" olacak.',
    category: 'Memur Sendikaları',
    source: 'Sendika Haberleri',
    date: '2024-03-12',
    imageUrl: 'https://picsum.photos/800/408'
  }
];

export const fetchMemurNews = async (): Promise<NewsItem[]> => {
  try {
    if (!NEWS_API_KEY) {
      console.warn('NewsAPI anahtarı bulunamadı, test verileri kullanılıyor.');
      return testNews;
    }

    const response = await axios.get(`${NEWS_API_URL}/everything`, {
      params: {
        q: 'memur OR memurlar OR memur maaş OR memur atama',
        language: 'tr',
        sortBy: 'publishedAt',
        apiKey: NEWS_API_KEY
      }
    });

    return response.data.articles.map((article: any, index: number) => ({
      id: index.toString(),
      title: article.title,
      content: article.description || article.content,
      category: categorizeNews(article.title, article.description || article.content),
      source: article.source.name,
      date: article.publishedAt,
      imageUrl: article.urlToImage
    }));
  } catch (error) {
    console.error('Haberler çekilirken hata oluştu:', error);
    return testNews;
  }
};

const categorizeNews = (title: string, content: string): string => {
  const text = (title + ' ' + content).toLowerCase();
  
  if (text.includes('maaş') || text.includes('zam') || text.includes('ödem')) {
    return 'Memur Maaşları';
  } else if (text.includes('atama') || text.includes('atanan') || text.includes('atanacak')) {
    return 'Memur Atamaları';
  } else if (text.includes('hak') || text.includes('izin') || text.includes('tatil')) {
    return 'Memur Hakları';
  } else if (text.includes('sınav') || text.includes('alım') || text.includes('kariyer')) {
    return 'Memur Sınavları';
  } else if (text.includes('emekli') || text.includes('emeklilik')) {
    return 'Memur Emeklilik';
  } else if (text.includes('sendika') || text.includes('konfederasyon')) {
    return 'Memur Sendikaları';
  } else {
    return 'Genel Memur Haberleri';
  }
};

export const getNewsByCategory = async (category: string): Promise<NewsItem[]> => {
  const allNews = await fetchMemurNews();
  return allNews.filter(news => news.category === category);
}; 