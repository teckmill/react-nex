import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider, persistAuth } from '../config/firebase';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "945310072782-5v0qqh8qe4jkgp0vvkbv0u3h2gfr3pqj.apps.googleusercontent.com",
    iosClientId: "945310072782-5v0qqh8qe4jkgp0vvkbv0u3h2gfr3pqj.apps.googleusercontent.com",
    clientId: "945310072782-5v0qqh8qe4jkgp0vvkbv0u3h2gfr3pqj.apps.googleusercontent.com"
  });

  useEffect(() => {
    const handleGoogleSignIn = async () => {
      if (response?.type === 'success') {
        try {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          const userCredential = await signInWithCredential(auth, credential);
          if (userCredential.user) {
            const token = await userCredential.user.getIdToken();
            await persistAuth(token);
            setUser(userCredential.user);
          }
        } catch (error) {
          console.error('Error handling Google sign-in:', error);
        }
      }
    };

    handleGoogleSignIn();
  }, [response]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await persistAuth(token);
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await promptAsync();
      if (result.type !== 'success') {
        throw new Error('Google Sign In was cancelled or failed');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('@auth_token');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  console.log('Auth object in context:', auth);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
