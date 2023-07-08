import { RequestResponse } from '../models/common';

type Handler = (req: RequestResponse) => RequestResponse;

export type RouterMap = Map<string, Handler>;

export type Routes = [string, Handler][];
