import axios from 'axios';

// Default to local proxy (/api) if VITE_API_URL is not set.
// This ensures local development works out of the box.
const baseURL = import.meta.env.VITE_API_URL || '/api';

console.log('API Client baseURL:', baseURL);

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

export default client;
