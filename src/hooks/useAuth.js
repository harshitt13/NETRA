import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import Loader from '../components/common/Loader';

// 1. Create the Authentication Context
const AuthContext = createContext(null);

// 2. Create the AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Functions to be exposed via the context
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      console.error("Firebase Login Error:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Firebase Logout Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Use useMemo to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
    }),
    [user, loading, error]
  );
  
  // Render a loader while checking auth state
  if (loading) {
    return <Loader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create the custom useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
