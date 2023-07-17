import { REQ_RES_TYPES } from '../constants';
import { Routes } from '../controller/index.types';
import DB from '../db';
import { GamesService } from './Games';
import { RegService } from './Reg';
import { RoomsService } from './Rooms';
import { WinnersService } from './Winners';

export class Services {
  private _reg: RegService;
  private _rooms: RoomsService;
  private _games: GamesService;
  private _winners: WinnersService;

  constructor(db: DB) {
    this._winners = new WinnersService(db);
    this._games = new GamesService(this._winners);
    this._rooms = new RoomsService(db, this._games);
    this._reg = new RegService(db, this._rooms, this._winners);
  }

  createRoutes = () => {
    const routes: Routes = [
      [REQ_RES_TYPES.REG, (req, ws) => this._reg.regUser(req, ws)],
      [REQ_RES_TYPES.CREATE_ROOM, (req, ws) => this._rooms.createRoom(req, ws)],
      [REQ_RES_TYPES.ADD_USER_TO_ROOM, (req, ws) => this._rooms.addUserToRoom(req, ws)],
      [REQ_RES_TYPES.ADD_SHIPS, (req, ws) => this._games.addShips(req, ws)],
      [REQ_RES_TYPES.ATTACK, (req, ws) => this._games.attack(req, ws)],
      [REQ_RES_TYPES.RANDOM_ATTACK, (req, ws) => this._games.randomAttack(req, ws)],
    ];
    return routes;
  };
}
