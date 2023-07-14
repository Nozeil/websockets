import { GameService } from '../Game';

export class GamesService {
  private _id: number;
  private _games: Map<number, GameService>;

  constructor() {
    this._games = new Map();
    this._id = 1;
  }

  createGame = (player1Id: number, player2Id: number) => {
    const game = new GameService(this._id, player1Id, player2Id);
    const responses = game.createGameResponses();
    this._games.set(this._id++, game);
    return responses;
  };
}
