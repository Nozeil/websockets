import { WS_PORT } from './src/constants';
import { httpServer } from './src/http_server';
import { startWsServer } from './src/ws_server';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = startWsServer();
wsServer.listen(WS_PORT, () => `Web socket server started on the ${WS_PORT} port!`);
