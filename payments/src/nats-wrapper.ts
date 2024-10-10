import nats, { Stan } from 'node-nats-streaming';

/**
 * Singleton class to wrap the NATS client, serving as single point of access to the NATS client.
 */
class NatsWrapper {
  // Initialize the client when we need the connection
  private _client?: Stan;

  // Accessor to get the client
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterID: string, clientID: string, url: string) {
    this._client = nats.connect(clusterID, clientID, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();