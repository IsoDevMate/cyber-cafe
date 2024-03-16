import React, { createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/context/auth';

const BackButtonContext = createContext();
export const useBackButton = () => useContext(BackButtonContext);

export const BackButtonProvider = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    if (user) {
      if (location.pathname !== '/') {
        alart("You are already signed in")
        navigate(-1, { replace: true });
      }
    }
  };

  const value = { handleBackClick };

  return (
    <BackButtonContext.Provider value={value}>
      {children}
    </BackButtonContext.Provider>
  );
};