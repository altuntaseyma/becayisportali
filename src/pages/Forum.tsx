import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    email: string;
  };
  createdAt: Date;
  comments: number;
}

export default function Forum() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'forum_posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as ForumPost[];
      setPosts(postsData);
    } catch (error) {
      console.error('Forum gönderileri yüklenirken hata:', error);
      setError('Gönderiler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await addDoc(collection(db, 'forum_posts'), {
        ...newPost,
        author: {
          id: currentUser.uid,
          email: currentUser.email
        },
        createdAt: Timestamp.now(),
        comments: 0
      });

      setNewPost({ title: '', content: '' });
      await fetchPosts();
    } catch (error) {
      console.error('Gönderi oluşturulurken hata:', error);
      setError('Gönderi oluşturulurken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Forum</h1>
        <p className="mt-2 text-gray-600">
          Diğer memurlarla iletişime geçin, sorularınızı sorun ve deneyimlerinizi paylaşın.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {currentUser && (
        <div className="mb-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Yeni Gönderi Oluştur</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Başlık
              </label>
              <input
                type="text"
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                İçerik
              </label>
              <textarea
                id="content"
                rows={4}
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Gönder
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                <span className="text-sm text-gray-500">
                  {post.createdAt.toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{post.content}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{post.author.email}</span>
                  <span>•</span>
                  <span>{post.comments} yorum</span>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Yorumları Görüntüle
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            Henüz hiç gönderi yok. İlk gönderinizi oluşturun!
          </div>
        )}
      </div>
    </div>
  );
} 