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

    ws.on('close', () => {
      controller.deleteUser(ws);
    });

    ws.on('message', async function message(data) {
      console.log('received: %s', data);

      try {
        const req: RequestResponse = JSON.parse(data.toString());
        const handler = controller.getHandler(req.type);

        if (handler) {
          const webSocketsWithResponses = await handler(req, this);

          webSocketsWithResponses.forEach((wsWithResponse) => {
            wsWithResponse.responses.forEach((response) => {
              const ws = wsWithResponse.ws;
              const stringifyedResponse = JSON.stringify(response);
              ws.send(stringifyedResponse, () =>
                console.log(`Command: ${response.type}, result:${stringifyedResponse}`)
              );
            });
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
