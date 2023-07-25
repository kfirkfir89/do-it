import { MongoClient } from 'mongodb';

const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DBNAME,
} = process.env;

const host = MONGO_HOST || '127.0.0.1';
const port = MONGO_PORT || 27017;
const dbName = MONGO_DBNAME || 'doit';

const MONGO_URI = `mongodb://${host}:${port}/${dbName}`;

export const client = new MongoClient(MONGO_URI);
export const db = client.db();
