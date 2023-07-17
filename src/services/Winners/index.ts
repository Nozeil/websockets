import { WebSocket } from 'ws';
import DB from '../../db';
import type { RequestResponse } from '../../models/common';
import type { HandlerReturnType } from '../../types';

export class WinnersService {
  private _db: DB;

  constructor(db: DB) {
    this._db = db;
  }

  updateWinners = () => {
    const data: { name: string; wins: number }[] = [];
    const result: HandlerReturnType = [];
    const webSockets = Array.from(this._db.getAllWebSockets());

    webSockets.forEach((ws) => {
      const user = this._db.getUser(ws);

      if (user) {
        data.push({ name: user.name, wins: user.wins });
      }
    });

    const response: RequestResponse = {
      type: 'update_winners',
      data: JSON.stringify(data),
      id: 0,
    };

    webSockets.forEach((ws) => {
      result.push({ ws, responses: [response] });
    });

    return result;
  };

  updateWinnersOnFinish = (ws: WebSocket) => {
    this._db.incrementUserWins(ws);

    const responses = this.updateWinners();

    return responses;
  };
}
