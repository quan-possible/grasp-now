import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration validation
const validateFirebaseConfig = () => {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingVars: string[] = [];
  const placeholderVars: string[] = [];

  for (const varName of requiredEnvVars) {
    const value = import.meta.env[varName];
    
    if (!value) {
      missingVars.push(varName);
    } else if (value.includes('placeholder') || value.includes('your-') || value === '123456789') {
      placeholderVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all Firebase configuration values are set.'
    );
  }

  if (placeholderVars.length > 0) {
    console.warn(
      `⚠️  Firebase placeholder values detected: ${placeholderVars.join(', ')}\n` +
      'Please replace with actual Firebase project values for full functionality.'
    );
  }
};

// Validate configuration before initializing
validateFirebaseConfig();

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID!,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
  appId: import.meta.env.VITE_FIREBASE_APP_ID!,
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw new Error('Firebase initialization failed. Please check your configuration.');
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;