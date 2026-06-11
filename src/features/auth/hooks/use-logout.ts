import { PATHS } from 'app/router/PATHS';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from 'store/use-auth-store';

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const performLogout = async (onLoggedOut?: () => void) => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout();
      navigate(PATHS.auth.login, { replace: true });
      onLoggedOut?.();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout: performLogout, isLoggingOut };
};
