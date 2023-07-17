import { WebSocket } from 'ws';
import DB from '../../db';
import { RequestResponse } from '../../models/common';
import { RegData } from '../../models/reg';
import type { RoomsService } from '../Rooms';
import type { Handler, HandlerReturnType } from '../../types';
import { WinnersService } from '../Winners';

export class RegService {
  private _db: DB;
  private _rooms: RoomsService;
  private _winners: WinnersService;

  constructor(db: DB, rooms: RoomsService, winners: WinnersService) {
    this._db = db;
    this._rooms = rooms;
    this._winners = winners;
  }

  isValidUser = ({ name, password }: RegData) => name.length >= 5 && password.length >= 5;

  regUser: Handler = (req, ws) => {
    const user = this.createUser(req, ws);
    const responses: RequestResponse[] = [user];
    const size = this._rooms.getSize();

    if (size) {
      responses.push(this._rooms.updateRoom());
    }

    const updateWinners = this._winners.updateWinners();

    const result: HandlerReturnType = [{ ws, responses }, ...updateWinners];

    return result;
  };

  createUser = ({ type, data, id }: RequestResponse, ws: WebSocket) => {
    const userData: RegData = JSON.parse(data);
    const isValid = this.isValidUser(userData);

    const resData = {
      name: userData.name,
      index: isValid ? this._db.setUser(ws, userData) : -1,
      error: !isValid,
      errorText: isValid ? '' : 'Name or password length should be not less than 5',
    };

    return {
      type,
      id,
      data: JSON.stringify(resData),
    };
  };
}
