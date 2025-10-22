"use client";

import { useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';

const ClientAuthInitializer = () => {
  const { setAuthStatus } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // In a real app, you'd want to validate the token with the backend
      // or decode it to get user info. For now, just assume it's valid.
      setAuthStatus(true); // Set authenticated status
    }
  }, [setAuthStatus]);

  return null; // This component doesn't render anything
};

export default ClientAuthInitializer;
