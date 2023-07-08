import { EOL } from 'os';
import { WS_PORT } from './src/constants';
import { httpServer } from './src/http_server';
import { startWsServer } from './src/ws_server';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = startWsServer();
wsServer.listen(WS_PORT, () => {
  const serverInfo = wsServer.address();

  if (serverInfo && typeof serverInfo !== 'string') {
    console.log(
      `Web socket server started!${EOL}Server info: ${EOL} Address - ${serverInfo.address} ${EOL} Port - ${serverInfo.port} ${EOL} Protocol version - ${serverInfo.family}`
    );
  }
});
