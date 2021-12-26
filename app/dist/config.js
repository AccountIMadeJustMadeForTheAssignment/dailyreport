"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
// You would want  to load these from environment variables
const config = {
    // should use an authenticated connection instead
    mongoDbUri: "mongodb://localhost:27017/",
    mongoDbName: "blocks-prod",
    ethNodeUrl: "ws://localhost:8546",
    blockConfirmationsRequired: 3,
};
const getConfig = () => config;
exports.getConfig = getConfig;
