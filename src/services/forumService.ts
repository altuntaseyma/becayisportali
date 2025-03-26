import { db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, orderBy, getDocs, Timestamp, arrayUnion } from 'firebase/firestore';
import { ForumPost, Comment } from '../types/database';

const FORUM_POSTS_COLLECTION = 'forumPosts';

export const forumService = {
  async createPost(userId: string, postData: Partial<ForumPost>): Promise<string> {
    const postRef = doc(collection(db, FORUM_POSTS_COLLECTION));
    const post: ForumPost = {
      id: postRef.id,
      userId,
      title: postData.title || '',
      content: postData.content || '',
      tags: postData.tags || [],
      comments: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    await setDoc(postRef, post);
    return post.id;
  },

  async getPost(postId: string): Promise<ForumPost | null> {
    const postDoc = await getDoc(doc(db, FORUM_POSTS_COLLECTION, postId));
    return postDoc.exists() ? postDoc.data() as ForumPost : null;
  },

  async getAllPosts(): Promise<ForumPost[]> {
    const q = query(
      collection(db, FORUM_POSTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as ForumPost);
  },

  async getUserPosts(userId: string): Promise<ForumPost[]> {
    const q = query(
      collection(db, FORUM_POSTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as ForumPost);
  },

  async addComment(postId: string, userId: string, content: string): Promise<void> {
    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      content,
      createdAt: Timestamp.now()
    };

    await updateDoc(doc(db, FORUM_POSTS_COLLECTION, postId), {
      comments: arrayUnion(comment),
      updatedAt: Timestamp.now()
    });
  },

  async searchPosts(searchTerm: string): Promise<ForumPost[]> {
    // Not: Firestore'da tam metin araması yapılamıyor
    // Bu yüzden basit bir başlık araması yapıyoruz
    const q = query(
      collection(db, FORUM_POSTS_COLLECTION),
      where('title', '>=', searchTerm),
      where('title', '<=', searchTerm + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as ForumPost);
  }
}; 