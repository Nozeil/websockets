import type { WebSocket } from 'ws';
import { RequestResponse } from '../models/common';

type Handler = (req: RequestResponse, ws: WebSocket) => RequestResponse[];

export type RouterMap = Map<string, Handler>;

export type Routes = [string, Handler][];
