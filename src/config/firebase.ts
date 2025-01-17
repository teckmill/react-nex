import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, GoogleAuthProvider } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdPHrELFjgCJqjHDqZ-bQZM_c1lFnFVgQ",
  authDomain: "accountadate-1f6a8.firebaseapp.com",
  projectId: "accountadate-1f6a8",
  storageBucket: "accountadate-1f6a8.appspot.com",
  messagingSenderId: "945310072782",
  appId: "1:945310072782:web:d7a0e3e2c9b9b9b9b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = initializeAuth(app);
console.log('Firebase Auth initialized:', auth);
console.log('Firebase Auth initialized:', auth);

// Create Google Provider
export const googleProvider = new GoogleAuthProvider();

// Persist auth state
export const persistAuth = async (token: string) => {
  try {
    await AsyncStorage.setItem('@auth_token', token);
  } catch (error) {
    console.error('Error persisting auth token:', error);
  }
};

export const getPersistedAuth = async () => {
  try {
    return await AsyncStorage.getItem('@auth_token');
  } catch (error) {
    console.error('Error getting persisted auth token:', error);
    return null;
  }
};
