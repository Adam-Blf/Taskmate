import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://taskmate-7roa.onrender.com/api';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

export default client;
