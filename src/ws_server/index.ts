import { WebSocket, WebSocketServer } from 'ws';
import { createServer } from 'http';
import type { RequestResponse } from '../models/common';
import { Controller } from '../controller';

export const startWsServer = () => {
  const server = createServer();

  const wss = new WebSocketServer({ server });

  const controller = new Controller();

  wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('close', () => {
      controller.deleteUser(ws);
    });

    ws.on('message', function message(data) {
      console.log('received: %s', data);

      try {
        const req: RequestResponse = JSON.parse(data.toString());
        const handler = controller.getHandler(req.type);

        if (handler) {
          const responses = handler(req, this);

          responses.forEach((serviceRes) => {
            const result = JSON.stringify(serviceRes);

            if (serviceRes.type === 'update_room' || serviceRes.type === 'update_winners') {
              wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(result);
                }
              });
            }

            this.send(result, () => console.log(`Command: ${serviceRes.type}, result:${result}`));
          });
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
