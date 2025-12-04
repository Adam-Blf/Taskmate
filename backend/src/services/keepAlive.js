import axios from 'axios';

/**
 * Service Keep-Alive pour maintenir le serveur actif sur Render
 * Empêche le service de se mettre en veille (plan gratuit)
 */
class KeepAliveService {
  constructor() {
    this.interval = null;
    this.isRunning = false;
    this.pingInterval = 14 * 60 * 1000; // 14 minutes (Render timeout à 15 min)
    this.selfUrl = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';
  }

  /**
   * Démarre le service keep-alive
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️ Keep-alive service is already running');
      return;
    }

    // Uniquement en production sur Render
    if (!process.env.RENDER_EXTERNAL_URL) {
      console.log('ℹ️ Keep-alive disabled (not running on Render)');
      return;
    }

    console.log(`🚀 Starting keep-alive service (ping every ${this.pingInterval / 1000 / 60} minutes)`);
    console.log(`🎯 Target URL: ${this.selfUrl}/api/health`);

    this.isRunning = true;

    // Premier ping immédiat
    this.ping();

    // Pings réguliers
    this.interval = setInterval(() => {
      this.ping();
    }, this.pingInterval);
  }

  /**
   * Arrête le service keep-alive
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.isRunning = false;
      console.log('⏹️ Keep-alive service stopped');
    }
  }

  /**
   * Effectue un ping vers le serveur
   */
  async ping() {
    try {
      const startTime = Date.now();
      const response = await axios.get(`${this.selfUrl}/api/health`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'TaskMate-KeepAlive/1.0'
        }
      });
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ Keep-alive ping successful (${duration}ms)`, {
        status: response.data.status,
        database: response.data.database,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Keep-alive ping failed:', {
        message: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Retourne le statut du service
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      pingInterval: this.pingInterval,
      selfUrl: this.selfUrl,
      nextPingIn: this.isRunning ? `${this.pingInterval / 1000 / 60} minutes` : 'N/A'
    };
  }
}

export default new KeepAliveService();
