import WebSocket from 'isomorphic-ws';

class OCPPClient {
  constructor(endpoint, identity, protocols) {
    this.endpoint = endpoint;
    this.identity = identity;
    this.protocols = protocols;
    this.socket = null;
    this.messageHandler = null;
    this.isConnected = false;
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.isConnected || this.socket) {
        return resolve(); // Prevent reconnecting if already connected or connecting
      }

      this.socket = new WebSocket(this.endpoint, this.protocols);

      this.socket.onopen = () => {
        console.log('Connected to the server');
        this.isConnected = true;
        resolve();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (this.messageHandler) {
          this.messageHandler(response);
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.socket = null;
        console.log('Disconnected from the server');
      };
    });
  }

  call(method, params) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected || !this.socket) {
        return reject(new Error('WebSocket is not connected'));
      }

      const message = JSON.stringify({ method, params });
      this.socket.send(message);

      this.socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        resolve(response);
      };

      this.socket.onerror = (error) => {
        reject(error);
      };
    });
  }

  onMessage(callback) {
    this.messageHandler = callback;
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default OCPPClient;
