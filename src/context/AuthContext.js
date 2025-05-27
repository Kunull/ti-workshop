import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4hZM_FTXrLf9GVwC3pjtFaRGLoAoWM6Y",
  projectId: "threat-intel-workshop-auth",
  authDomain: "threat-intel-workshop-auth.firebaseapp.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          username: user.displayName || user.email.split('@')[0]
        });
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Register a new user
  const register = async (email, password, displayName) => {
    try {
      setError('');
      setLoading(true);
      
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Set display name if provided
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
      
      // Update current user
      setCurrentUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || email.split('@')[0],
        username: displayName || email.split('@')[0]
      });
      
      return userCredential.user;
    } catch (err) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Login an existing user
  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update current user
      setCurrentUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || userCredential.user.email.split('@')[0],
        username: userCredential.user.displayName || userCredential.user.email.split('@')[0]
      });
      
      return userCredential.user;
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        throw new Error('User not found');
      } else if (err.code === 'auth/wrong-password') {
        throw new Error('Incorrect password');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout the current user
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };
  
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
