import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Function to get the API base URL dynamically
const getApiBaseUrl = () => {
  // In a real application, this would be more robust.
  // For development, we can assume a local API or a known endpoint.
  // For production, it might be derived from the current domain or a specific env var.
  if (typeof window !== 'undefined') {
    // Client-side
    const hostname = window.location.hostname;
    // Example: if shop is shopname.example.com, API might be api.example.com
    // This is a simplified example, adjust based on actual API deployment
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'http://localhost:8000'; // Local API for development
    } else {
      // For deployed shops, assume API is at api.yourdomain.com
      const parts = hostname.split('.');
      if (parts.length > 2) {
        return `https://api.${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
      } else {
        return `https://api.${hostname}`;
      }
    }
  }
  // Server-side (for SSR/SSG)
  // You might need a specific environment variable for server-side API calls
  return process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8000';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add API Key and Host header for all requests
api.interceptors.request.use(
  (config) => {
    let token = null;
    let guestWishlistToken = null;
    // This code will only run on the client-side, where `window` is defined
    if (typeof window !== 'undefined') {
      config.headers['X-Shop-Domain'] = window.location.hostname;
      token = localStorage.getItem('jwt_token');
      guestWishlistToken = localStorage.getItem('guest_wishlist_token'); // Get guest wishlist token
    }

    // For server-side requests, the X-Shop-Domain header should be passed in the request config.
    
    // Use JWT token if it was found, otherwise fall back to the API Key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (API_KEY) {
      config.headers.Authorization = `Bearer ${API_KEY}`;
    }

    // Add X-Guest-Wishlist-Token if available
    if (guestWishlistToken) {
      config.headers['X-Guest-Wishlist-Token'] = guestWishlistToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
