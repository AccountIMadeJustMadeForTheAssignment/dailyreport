"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlocksCollection = exports.getDb = exports.connect = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("./config");
let _client;
let _db;
const getClient = () => {
    const uri = (0, config_1.getConfig)().mongoDbUri;
    if (!_client) {
        _client = new mongodb_1.MongoClient(uri);
    }
    return _client;
};
/** @description Connects client to database server and returns db instance based on config */
const connect = () => getClient()
    .connect()
    .then((client) => {
    _db = client.db((0, config_1.getConfig)().mongoDbName);
    return _db;
});
exports.connect = connect;
const getDb = () => {
    if (!_db) {
        throw Error("Accessing DB instance before establishing client connection");
    }
    return _db;
};
exports.getDb = getDb;
const getBlocksCollection = () => (0, exports.getDb)().collection("blocks");
exports.getBlocksCollection = getBlocksCollection;
