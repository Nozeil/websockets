import type { RequestResponse } from './models/common';
import type { WebSocket } from 'ws';

export type HandlerReturnType = { ws: WebSocket; responses: RequestResponse[] }[];

export type Handler = (
  req: RequestResponse,
  ws: WebSocket
) => HandlerReturnType | Promise<HandlerReturnType>;
