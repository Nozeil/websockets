import { REQ_RES_TYPES } from '../constants';
import { Routes } from '../controller/index.types';
import DB from '../db';
import { RegService } from './Reg';
import { RoomsService } from './Rooms';

export class Services {
  private _reg: RegService;
  private _rooms: RoomsService;

  constructor(db: DB) {
    this._rooms = new RoomsService(db);
    this._reg = new RegService(db, this._rooms);
  }

  createRoutes = () => {
    const routes: Routes = [
      [REQ_RES_TYPES.REG, (req, ws) => this._reg.regUser(req, ws)],
      [REQ_RES_TYPES.CREATE_ROOM, (req, ws) => this._rooms.createRoom(req, ws)],
      [REQ_RES_TYPES.ADD_USER_TO_ROOM, (req, ws) => this._rooms.addUserToRoom(req, ws)],
    ];
    return routes;
  };
}
