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
      ['reg', (req, ws) => this._reg.getResponses(req, ws)],
      ['create_room', (req, ws) => this._rooms.getResponses(req, ws)],
    ];
    return routes;
  };
}
