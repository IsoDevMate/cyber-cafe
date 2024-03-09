import React from 'react';
import { useAuth } from '../auth/context/auth';
import { useNavigate } from 'react-router-dom';

const AuthGuard = (Component) => {
  const AuthGuardedComponent = (props) => {
    const { user, isAuthLoading } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
      if (!isAuthLoading && !user) {
        navigate('/signin', { replace: true });
      }
    }, [user, isAuthLoading, navigate]);

    if (isAuthLoading) {
      return <div>Loading...</div>;
    }

    return user ? <Component {...props} /> : null;
  };

  return AuthGuardedComponent;
};

export default AuthGuard;