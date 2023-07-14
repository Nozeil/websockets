import type { WebSocket } from 'ws';
import { RequestResponse } from '../models/common';

type Handler = (
  req: RequestResponse,
  ws: WebSocket
) => { ws: WebSocket; responses: RequestResponse[] }[];

export type RouterMap = Map<string, Handler>;

export type Routes = [string, Handler][];
