import { WebSocketServer } from 'ws';
import { createServer } from 'http';

export const startWsServer = () => {
  const server = createServer();

  const wss = new WebSocketServer({ server });

  wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });
  });

  return server;
};
