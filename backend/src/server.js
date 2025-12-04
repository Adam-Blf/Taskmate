import 'dotenv/config';
import app from './app.js';
import keepAliveService from './services/keepAlive.js';

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`TaskMate API listening on port ${port}`);
  
  // Démarrer le service keep-alive
  keepAliveService.start();
});

// Arrêt gracieux
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  keepAliveService.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  keepAliveService.stop();
  process.exit(0);
});
