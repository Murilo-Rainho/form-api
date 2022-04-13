import { Collection, MongoClient } from 'mongodb';

export const mongoHelper = {
  client: null as MongoClient,
  async connect(mongoUrl: string): Promise<void> {
    this.client = await MongoClient.connect(mongoUrl);
  },
  async disconnect(): Promise<void> {
    await this.client.close();
  },
  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },
};
