/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyBYs_b2yPnyliJor0eILWramc8LQEBChIw",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "becayisplatformu.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_DATABASE_URL: "https://becayisplatformu-default-rtdb.europe-west1.firebasedatabase.app",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "becayisplatformu",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "becayisplatformu.firebasestorage.app",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "452331817845",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:452331817845:web:43a204d41625662d7f213c",
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-G88MJ2P23Z"
  },
  // Client-side process.env desteği için
  publicRuntimeConfig: {
    firebaseConfig: {
      apiKey: "AIzaSyBYs_b2yPnyliJor0eILWramc8LQEBChIw",
      authDomain: "becayisplatformu.firebaseapp.com",
      databaseURL: "https://becayisplatformu-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "becayisplatformu",
      storageBucket: "becayisplatformu.firebasestorage.app",
      messagingSenderId: "452331817845",
      appId: "1:452331817845:web:43a204d41625662d7f213c",
      measurementId: "G-G88MJ2P23Z"
    }
  },
};

module.exports = nextConfig; 