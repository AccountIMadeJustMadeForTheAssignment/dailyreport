"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const startup_1 = require("./startup");
const syncBlocks_1 = require("./syncBlocks");
const hostname = "127.0.0.1";
const port = 3003;
const server = http_1.default.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("runnign");
});
server.listen(port, hostname, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, startup_1.startup)();
    (0, syncBlocks_1.streamNewBlocksFromNodeToDb)();
    console.log(`Server running at http://${hostname}:${port}/`);
}));
