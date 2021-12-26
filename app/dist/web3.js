"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeb3 = void 0;
const web3_1 = __importDefault(require("web3"));
const config_1 = require("./config");
let _web3;
const getWeb3 = () => {
    if (!_web3) {
        _web3 = new web3_1.default((0, config_1.getConfig)().ethNodeUrl);
    }
    return _web3;
};
exports.getWeb3 = getWeb3;
