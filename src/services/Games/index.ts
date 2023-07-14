import { WebSocket } from 'ws';
import type { RequestResponse } from '../../models/common';
import { AddShips } from '../../models/game';
import { GameService } from '../Game';

export class GamesService {
  private _id: number;
  private _games: Map<number, GameService>;

  constructor() {
    this._games = new Map();
    this._id = 1;
  }

  createGame = (ws1: WebSocket, ws2: WebSocket, player1Id: number, player2Id: number) => {
    const game = new GameService(this._id, player1Id, player2Id, ws1, ws2);
    const responses = game.createGameResponses();
    this._games.set(this._id++, game);
    return responses;
  };

  addShips = (req: RequestResponse, _: WebSocket) => {
    const { gameId, indexPlayer, ships }: AddShips = JSON.parse(req.data);
    const game = this._games.get(gameId);

    return game?.setShips(indexPlayer, ships) ?? [];
  };
}
