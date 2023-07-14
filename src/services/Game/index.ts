import { REQ_RES_TYPES } from '../../constants';
import { RequestResponse } from '../../models/common';

export class GameService {
  private _id: number;
  private _player1Id: number;
  private _player2Id: number;

  constructor(id: number, player1Id: number, player2Id: number) {
    this._id = id;
    this._player1Id = player1Id;
    this._player2Id = player2Id;
  }

  createGameResponses = () => {
    const players = [this._player1Id, this._player2Id];

    return players.reduce<Map<number, RequestResponse>>((acc, idPlayer) => {
      const data = {
        idGame: this._id,
        idPlayer,
      };

      acc.set(idPlayer, {
        type: REQ_RES_TYPES.CREATE_GAME,
        data: JSON.stringify(data),
        id: 0,
      });

      return acc;
    }, new Map());
  };
}
