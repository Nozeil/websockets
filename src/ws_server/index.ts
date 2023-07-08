import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import type { RequestResponse } from '../models/common';
import { Controller } from '../controller';

export const startWsServer = () => {
  const server = createServer();

  const wss = new WebSocketServer({ server });
  const controller = new Controller();

  wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
      console.log('received: %s', data);

      try {
        const req: RequestResponse = JSON.parse(data.toString());
        const handler = controller.getHandler(req.type);

        if (handler) {
          const resp = handler(req);
          const result = JSON.stringify(resp);
          console.log(`Command: ${resp.type}, result:${result}`);
          ws.send(result);
        } else {
          console.error('Wrong type');
        }
      } catch (e) {
        console.error(e);
      }
    });
  });

  return server;
};
