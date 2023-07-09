import type { WebSocket } from 'ws';
import type { RegData } from '../models/reg';
import { User } from './index.types';

class DB {
  private _db: Map<WebSocket, User>;
  private _userIndex: number;

  constructor() {
    this._db = new Map();
    this._userIndex = 1;
  }

  private increaseIndex() {
    this._userIndex += 1;
  }

  setUser = (ws: WebSocket, { name, password }: RegData) => {
    const index = this._userIndex;
    const user = { name, password, index };
    this._db.set(ws, user);
    this.increaseIndex();
    return index;
  };

  deleteUser = (ws: WebSocket) => {
    this._db.delete(ws);
  };
}

export default DB;
