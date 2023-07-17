import type { WebSocket } from 'ws';
import type { RegData } from '../models/reg';
import { User } from './index.types';

class DB {
  private static _instance: DB;
  private _db: Map<WebSocket, User>;
  private _userIndex: number;

  private constructor() {
    this._db = new Map();
    this._userIndex = 1;
  }

  static getInstance = () => {
    if (!DB._instance) {
      DB._instance = new DB();
    }

    return DB._instance;
  };

  getUser = (ws: WebSocket) => {
    return this._db.get(ws);
  };

  setUser = (ws: WebSocket, { name, password }: RegData) => {
    const user = { name, password, index: this._userIndex++, ws, wins: 0 };
    this._db.set(ws, user);
    return user.index;
  };

  deleteUser = (ws: WebSocket) => {
    this._db.delete(ws);
  };

  getAllWebSockets = () => {
    return this._db.keys();
  };

  incrementUserWins = (ws: WebSocket) => {
    const user = this.getUser(ws);

    if (user) {
      user.wins++;
    }
  };
}

export default DB;
