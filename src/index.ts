import { createServer } from 'http';
import { config } from 'dotenv';

config();

createServer((req, res) => {
  res.writeHead(200, { 'Content-type': 'text/plain' });

  res.end('Hello World');
}).listen(process.env.PUBLISHED_PORT);
