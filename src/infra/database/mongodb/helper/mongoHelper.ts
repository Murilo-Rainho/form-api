import { Collection, MongoClient } from 'mongodb';

export const mongoHelper = {
  isConnected: false,
  client: null as MongoClient,
  mongoUrl: null as string,
  async connect(mongoUrl: string): Promise<void> {
    this.mongoUrl = mongoUrl;
    this.client = await MongoClient.connect(mongoUrl);
    this.isConnected = true;
  },
  async disconnect(): Promise<void> {
    await this.client.close();
    this.isConnected = false;
    this.client = null;
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this.isConnected) {
      await this.connect(this.mongoUrl);
    }
    return this.client.db().collection(name);
  },
};
