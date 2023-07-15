import { Handler } from '../types';

export type RouterMap = Map<string, Handler>;

export type Routes = [string, Handler][];
