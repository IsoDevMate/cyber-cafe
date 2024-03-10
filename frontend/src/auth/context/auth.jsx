import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Add an observer for changes to the user's sign-in state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);