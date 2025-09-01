// import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
// import {
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
// } from 'firebase/auth';
// import { auth } from '../firebase/firebaseConfig';
// import Loader from '../components/common/Loader';

// // 1. Create the Authentication Context
// const AuthContext = createContext(null);

// // 2. Create the AuthProvider Component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Listen to Firebase auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, []);

//   // Functions to be exposed via the context
//   const login = async (email, password) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       setUser(userCredential.user);
//       return userCredential.user;
//     } catch (err) {
//       setError(err.message);
//       console.error("Firebase Login Error:", err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     setLoading(true);
//     try {
//       await signOut(auth);
//       setUser(null);
//     } catch (err) {
//       console.error("Firebase Logout Error:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Use useMemo to prevent unnecessary re-renders
//   const value = useMemo(
//     () => ({
//       user,
//       loading,
//       error,
//       login,
//       logout,
//     }),
//     [user, loading, error]
//   );

//   // Render a loader while checking auth state
//   if (loading) {
//     return <Loader />;
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // 3. Create the custom useAuth hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Loader from "../components/common/Loader";

// Mock user data
const MOCK_USER = {
  uid: "root-user-001",
  email: "admin@netra.com",
  displayName: "Root Administrator",
  getIdToken: async () => "mock-jwt-token-12345", // Mock JWT token
};

// Hardcoded credentials
const ROOT_CREDENTIALS = {
  email: "admin@netra.com",
  password: "netra123",
};

// 1. Create the Authentication Context
const AuthContext = createContext(null);

// 2. Create the AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine if mock authentication should be used (e.g., based on environment variable)
  const useMockAuth = process.env.REACT_APP_USE_MOCK_AUTH === "true" || true; // Default to mock auth

  // Firebase auth state listener
  useEffect(() => {
    let unsubscribe;
    if (!useMockAuth) {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
    } else {
      // Check if user is already logged in (from sessionStorage) for mock auth
      const savedUser = sessionStorage.getItem("netra_user");
      if (savedUser) {
        // Always use MOCK_USER object to preserve methods, but check session for persistence
        setUser(MOCK_USER);
      } else {
        // Auto-login with default credentials for demo purposes
        setUser(MOCK_USER);
        sessionStorage.setItem("netra_user", JSON.stringify(MOCK_USER));
      }
      setLoading(false);
    }

    // Cleanup subscription on unmount
    return () => unsubscribe && unsubscribe();
  }, [useMockAuth]);

  // Firebase login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      if (useMockAuth) {
        // Simulate API call delay for mock auth
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (
          email === ROOT_CREDENTIALS.email &&
          password === ROOT_CREDENTIALS.password
        ) {
          setUser(MOCK_USER);
          sessionStorage.setItem("netra_user", JSON.stringify(MOCK_USER));
          return { success: true };
        } else {
          throw new Error(
            "Invalid credentials. Use admin@netra.com / netra123"
          );
        }
      } else {
        // Firebase auth
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUser(userCredential.user);
        return userCredential.user;
      }
    } catch (err) {
      setError(err.message);
      console.error("Login Error:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      if (useMockAuth) {
        setUser(null);
        sessionStorage.removeItem("netra_user");
      } else {
        await signOut(auth);
        setUser(null);
      }
    } catch (err) {
      console.error("Logout Error:", err.message);
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
