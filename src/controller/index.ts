import type { WebSocket } from 'ws';
import DB from '../db';
import { Services } from '../services';
import { RouterMap } from './index.types';

export class Controller {
  private _db: DB;
  private _services: Services;
  private _router: RouterMap;

  constructor() {
    this._db = DB.getInstance();
    this._services = new Services(this._db);
    this._router = new Map(this._services.createRoutes());
  }

  getHandler = (type: string) => {
    return this._router.get(type);
  };

  deleteUser = (ws: WebSocket) => {
    this._db.deleteUser(ws);
  };
}
