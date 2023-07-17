import { WebSocket } from 'ws';
import type { AddShips, AttackReq, RandomAttackReq } from '../../models/game';
import { GameService } from '../Game';
import type { Handler } from '../../types';
import { WinnersService } from '../Winners';

export class GamesService {
  private _id: number;
  private _games: Map<number, GameService>;
  private _winners: WinnersService;

  constructor(winners: WinnersService) {
    this._games = new Map();
    this._id = 1;
    this._winners = winners;
  }

  getGameId = () => {
    return this._id;
  };

  createGame = (ws1: WebSocket, ws2: WebSocket, player1Id: number, player2Id: number) => {
    const game = new GameService(this._id, player1Id, player2Id, ws1, ws2);
    const responses = game.createGameResponses();
    this._games.set(this._id++, game);
    return responses;
  };

  addShips: Handler = (req, _) => {
    const { gameId, indexPlayer, ships }: AddShips = JSON.parse(req.data);
    const game = this._games.get(gameId);

    return game?.setShips(indexPlayer, ships) ?? [];
  };

  attack: Handler = (req, _) => {
    const { gameId, indexPlayer, x, y }: AttackReq = JSON.parse(req.data);
    const game = this._games.get(gameId);

    return game?.attack(this._winners, indexPlayer, x, y) ?? [];
  };

  randomAttack: Handler = (req, _) => {
    const { gameId, indexPlayer }: RandomAttackReq = JSON.parse(req.data);
    const game = this._games.get(gameId);

    const [randomX, randomY] = [this.generateRandomCoordinate(), this.generateRandomCoordinate()];

    return game?.attack(this._winners, indexPlayer, randomX, randomY) ?? [];
  };

  generateRandomCoordinate = () => {
    return Math.floor(Math.random() * 10);
  };
}
