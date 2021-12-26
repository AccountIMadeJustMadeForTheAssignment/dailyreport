import { Db, MongoClient } from 'mongodb';

import { getConfig } from './config';
import { BlockDocument } from './schema';

let _client: MongoClient | undefined;
let _db: Db | undefined;
const getClient = () => {
  const uri = getConfig().mongoDbUri;
  if (!_client) {
    _client = new MongoClient(uri);
  }
  return _client;
};
/** @description Connects client to database server and returns db instance based on config */
export const connect = () =>
  getClient()
    .connect()
    .then((client) => {
      _db = client.db(getConfig().mongoDbName);
      console.debug("Connected to db");
      return _db;
    });

export const getDb = () => {
  if (!_db) {
    throw Error("Accessing DB instance before establishing client connection");
  }
  return _db;
};
export const getBlocksCollection = () =>
  getDb().collection<BlockDocument>("blocks");
