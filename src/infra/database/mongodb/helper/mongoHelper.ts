import { Collection, MongoClient } from 'mongodb';

export const mongoHelper = {
  client: null as MongoClient,
  mongoUrl: null as string,
  async connect(mongoUrl: string): Promise<void> {
    this.mongoUrl = mongoUrl;
    this.client = await MongoClient.connect(mongoUrl);
  },
  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.mongoUrl);
    }
    return this.client.db().collection(name);
  },
};
