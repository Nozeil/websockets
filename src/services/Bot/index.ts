import { WebSocket } from 'ws';
import type { Handler, HandlerReturnType } from '../../types';
import { GamesService } from '../Games';
import { REQ_RES_TYPES, WS_PORT } from '../../constants';
import { RequestResponse } from '../../models/common';

export class BotService {
  private _games: GamesService;
  private _ws: WebSocket;
  private _gameId: number;
  private _botId: -2;
  private _playerId: -1;

  constructor(games: GamesService) {
    this._ws = new WebSocket(`ws://localhost:${WS_PORT}`);
    this._games = games;
    this._gameId = -1;
    this._botId = -2;
    this._playerId = -1;
  }

  createGame: Handler = (_, ws) => {
    const responses = this.createGameResponses(ws, this._playerId, this._ws, this._botId);

    return responses;
  };

  setGameId = () => {
    const id = this._games.getGameId();
    this._gameId = id;
  };

  createGameResponses = (
    playerWs: WebSocket,
    playerId: number,
    botWs: WebSocket,
    botId: number
  ) => {
    const result: HandlerReturnType = [];
    this.setGameId();
    const gameResponses = this._games.createGame(playerWs, this._ws, playerId, botId);

    const playerResponse = gameResponses.get(playerId);
    const botResponse = gameResponses.get(botId);

    if (playerResponse && botResponse) {
      result.push(
        { ws: playerWs, responses: [playerResponse] },
        { ws: botWs, responses: [playerResponse] }
      );
    }

    return result;
  };

  addShips: Handler = () => {
    const ships = this.getShipsFromTemplate();
    const result: HandlerReturnType = [{ ws: this._ws, responses: [ships] }];
    return result;
  };

  getShipsFromTemplate = () => {
    const shipsTemplate = [
      {
        type: 'add_ships',
        data: `{"gameId":${this._gameId},"ships":[{"position":{"x":1,"y":9},"direction":false,"type":"huge","length":4},{"position":{"x":9,"y":0},"direction":true,"type":"large","length":3},{"position":{"x":0,"y":7},"direction":false,"type":"large","length":3},{"position":{"x":1,"y":4},"direction":false,"type":"medium","length":2},{"position":{"x":3,"y":0},"direction":true,"type":"medium","length":2},{"position":{"x":7,"y":5},"direction":false,"type":"medium","length":2},{"position":{"x":0,"y":1},"direction":false,"type":"small","length":1},{"position":{"x":6,"y":0},"direction":true,"type":"small","length":1},{"position":{"x":6,"y":2},"direction":false,"type":"small","length":1},{"position":{"x":7,"y":7},"direction":false,"type":"small","length":1}],"indexPlayer":${this._botId}}`,
        id: 0,
      },
      {
        type: 'add_ships',
        data: `{"gameId":${this._gameId},"ships":[{"position":{"x":4,"y":4},"direction":true,"type":"huge","length":4},{"position":{"x":1,"y":1},"direction":true,"type":"large","length":3},{"position":{"x":5,"y":0},"direction":true,"type":"large","length":3},{"position":{"x":1,"y":5},"direction":true,"type":"medium","length":2},{"position":{"x":7,"y":0},"direction":false,"type":"medium","length":2},{"position":{"x":1,"y":8},"direction":true,"type":"medium","length":2},{"position":{"x":5,"y":9},"direction":true,"type":"small","length":1},{"position":{"x":8,"y":6},"direction":false,"type":"small","length":1},{"position":{"x":6,"y":5},"direction":false,"type":"small","length":1},{"position":{"x":6,"y":7},"direction":true,"type":"small","length":1}],"indexPlayer":${this._botId}}`,
        id: 0,
      },
      {
        type: 'add_ships',
        data: `{"gameId":${this._gameId},"ships":[{"position":{"x":2,"y":3},"direction":true,"type":"huge","length":4},{"position":{"x":4,"y":4},"direction":true,"type":"large","length":3},{"position":{"x":6,"y":5},"direction":false,"type":"large","length":3},{"position":{"x":7,"y":1},"direction":false,"type":"medium","length":2},{"position":{"x":1,"y":0},"direction":true,"type":"medium","length":2},{"position":{"x":6,"y":7},"direction":false,"type":"medium","length":2},{"position":{"x":0,"y":6},"direction":false,"type":"small","length":1},{"position":{"x":5,"y":9},"direction":false,"type":"small","length":1},{"position":{"x":2,"y":8},"direction":false,"type":"small","length":1},{"position":{"x":3,"y":1},"direction":false,"type":"small","length":1}],"indexPlayer":${this._botId}}`,
        id: 0,
      },
      {
        type: 'add_ships',
        data: `{"gameId":${this._gameId},"ships":[{"position":{"x":5,"y":2},"direction":true,"type":"huge","length":4},{"position":{"x":4,"y":7},"direction":true,"type":"large","length":3},{"position":{"x":2,"y":6},"direction":true,"type":"large","length":3},{"position":{"x":2,"y":2},"direction":true,"type":"medium","length":2},{"position":{"x":9,"y":6},"direction":true,"type":"medium","length":2},{"position":{"x":6,"y":7},"direction":true,"type":"medium","length":2},{"position":{"x":8,"y":1},"direction":true,"type":"small","length":1},{"position":{"x":3,"y":0},"direction":true,"type":"small","length":1},{"position":{"x":1,"y":0},"direction":true,"type":"small","length":1},{"position":{"x":5,"y":0},"direction":true,"type":"small","length":1}],"indexPlayer":${this._botId}}`,
        id: 0,
      },
      {
        type: 'add_ships',
        data: `{"gameId":${this._gameId},"ships":[{"position":{"x":8,"y":1},"direction":true,"type":"huge","length":4},{"position":{"x":4,"y":6},"direction":false,"type":"large","length":3},{"position":{"x":0,"y":5},"direction":false,"type":"large","length":3},{"position":{"x":0,"y":7},"direction":false,"type":"medium","length":2},{"position":{"x":8,"y":7},"direction":true,"type":"medium","length":2},{"position":{"x":1,"y":2},"direction":false,"type":"medium","length":2},{"position":{"x":5,"y":2},"direction":false,"type":"small","length":1},{"position":{"x":3,"y":8},"direction":false,"type":"small","length":1},{"position":{"x":2,"y":0},"direction":true,"type":"small","length":1},{"position":{"x":4,"y":4},"direction":false,"type":"small","length":1}],"indexPlayer":${this._botId}}`,
        id: 0,
      },
    ] as const;
    const shipsIndex = Math.floor(Math.random() * shipsTemplate.length);
    const ships = shipsTemplate[shipsIndex];

    return ships;
  };

  attack: Handler = async (_, ws) => {
    const result: HandlerReturnType = [];
    const mockReq: RequestResponse = {
      type: REQ_RES_TYPES.RANDOM_ATTACK,
      data: JSON.stringify({ gameId: this._gameId, indexPlayer: this._botId }),
      id: 0,
    };

    const timeoutAttack = new Promise<HandlerReturnType>((res) => {
      setTimeout(async () => {
        const responses = await this._games.randomAttack(mockReq, ws);
        res(responses);
      }, 5000);
    });

    const responses = await timeoutAttack;

    result.push(...responses);

    return result;
  };

  finish: Handler = () => {
    const result: HandlerReturnType = [];
    return result;
  };

  startGame: Handler = () => {
    const result: HandlerReturnType = [];
    return result;
  };
}
