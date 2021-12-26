import http from 'http';

import { startup } from './startup';
import { streamNewBlocksFromNodeToDb } from './syncBlocks';

const hostname = "127.0.0.1";
const port = 3003;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("runnign");
});

server.listen(port, hostname, async () => {
  await startup();
  streamNewBlocksFromNodeToDb();
  console.log(`Server running at http://${hostname}:${port}/`);
});
