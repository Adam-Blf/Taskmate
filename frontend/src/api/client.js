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
  timeout: 30000 // 30 seconds timeout (increased for Render cold starts)
});

// Add response interceptor for better error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - the server took too long to respond');
      error.message = 'Le serveur met trop de temps à répondre. Veuillez réessayer.';
    } else if (error.response) {
      // Server responded with error status
      console.error('Server error:', error.response.status, error.response.data);
      if (error.response.status === 503) {
        error.message = 'Service temporairement indisponible. La base de données se connecte...';
      } else if (error.response.status === 404) {
        error.message = 'Endpoint non trouvé. Vérifiez que le backend est à jour.';
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server:', error.request);
      error.message = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    }
    return Promise.reject(error);
  }
);

export default client;
