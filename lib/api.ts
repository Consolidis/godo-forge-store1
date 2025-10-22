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
    if (typeof window !== 'undefined') {
      // Add Host header for shop identification
      config.headers['X-Shop-Domain'] = window.location.hostname; // Or a more specific shop identifier
    }

    // Add JWT token if available (for authenticated customer requests)
    const token = localStorage.getItem('jwt_token'); // Or from HTTP-only cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (API_KEY) {
      // If no JWT, use API Key for public routes
      config.headers.Authorization = `Bearer ${API_KEY}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
