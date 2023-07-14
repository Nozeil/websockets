import { WebSocket } from 'ws';
import { REQ_RES_TYPES } from '../../constants';
import type { HandlerReturnType, RequestResponse } from '../../models/common';
import type { Ships } from '../../types';

export class GameService {
  private _id: number;
  private _players: Map<number, { ws: WebSocket; id: number; ships: Ships }>;
  private _turn: number;

  constructor(id: number, player1Id: number, player2Id: number, ws1: WebSocket, ws2: WebSocket) {
    this._id = id;
    this._players = new Map([
      [player1Id, { ws: ws1, id: player1Id, ships: [] }],
      [player2Id, { ws: ws2, id: player2Id, ships: [] }],
    ]);
    this._turn = this.randomizeFirstTurn();
  }

  createGameResponses = () => {
    const ids = Array.from(this._players.keys());

    return ids.reduce<Map<number, RequestResponse>>((acc, idPlayer) => {
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

  getAllPlayers = () => {
    return Array.from(this._players.values());
  };

  getAllPlayersIds = () => {
    return Array.from(this._players.keys());
  };

  setShips = (playerId: number, ships: Ships) => {
    const player = this._players.get(playerId);

    if (player) {
      player.ships = ships;
      this._players.set(player.id, player);
    }

    const players = this.getAllPlayers();
    const canStart = players.every((player) => player.ships.length > 0);

    if (canStart) {
      return this.startGame();
    }
  };

  startGame = () => {
    const result: HandlerReturnType = [];

    this._players.forEach((player) => {
      const data = JSON.stringify({ ships: player.ships, currentPlayerIndex: player.id });
      const startResponse: RequestResponse = { type: REQ_RES_TYPES.START_GAME, data, id: 0 };
      const turnResponse = this.getTurnResp();
      const responses = [startResponse, turnResponse];
      result.push({ ws: player.ws, responses });
    });

    return result;
  };

  randomizeFirstTurn = () => {
    const random = Math.random();
    const [player1Id, player2Id] = this.getAllPlayersIds();

    return random > 0.5 ? player1Id : player2Id;
  };

  switchTurn = () => {
    const ids = this.getAllPlayersIds();
    const turn = ids.find((id) => id !== this._turn);

    if (turn) {
      this._turn = turn;
    }
  };

  getTurnResp = () => {
    const data = JSON.stringify({
      currentPlayer: this._turn,
    });

    const response: RequestResponse = {
      type: REQ_RES_TYPES.TURN,
      data,
      id: 0,
    };

    return response;
  };
}
