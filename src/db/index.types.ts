import type { WebSocket } from 'ws';
import type { RegData } from '../models/reg';

export interface User extends RegData {
  ws: WebSocket;
  index: number;
}
