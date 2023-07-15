import type { RequestResponse } from './models/common';
import type { WebSocket } from 'ws';

export type Handler = (
  req: RequestResponse,
  ws: WebSocket
) => { ws: WebSocket; responses: RequestResponse[] }[];

export type HandlerReturnType = ReturnType<Handler>;
