import React from 'react';
import { useAuth } from './context/auth';
import { useNavigate } from 'react-router-dom';

const AuthGuard = (Component) => {
  const AuthGuardedComponent = (props) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
      if (!user) {
        // If the user is not authenticated, redirect to the login page
        navigate('/signin', { replace: true });
      }
    }, [user, navigate]);

    // If the user is authenticated, render the component
    return user ? <Component {...props} /> : null;
  };

  return AuthGuardedComponent;
};

export default AuthGuard;