import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const BackButtonContext = createContext();

export const useBackButton = () => useContext(BackButtonContext);

export const BackButtonProvider = ({ children }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const value = {
    handleBackClick,
  };

  return <BackButtonContext.Provider value={value}>{children}</BackButtonContext.Provider>;
};