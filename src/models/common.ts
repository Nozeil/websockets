import { WebSocket } from 'ws';

export interface RequestResponse {
  type: string;
  data: string;
  id: 0;
}

export type HandlerReturnType = { ws: WebSocket; responses: RequestResponse[] }[];
