import { WebSocket } from 'ws';
import { REQ_RES_TYPES } from '../../constants';
import type { RequestResponse } from '../../models/common';
import { Ship } from '../Ship';
import { ShipsReq } from '../../models/game';
import type { HandlerReturnType } from '../../types';
import { WinnersService } from '../Winners';

export class GameService {
  private _id: number;
  private _players: Map<
    number,
    {
      ws: WebSocket;
      id: number;
      ships: Ship[];
      shipsRes: ShipsReq;
    }
  >;
  private _turn: number;

  constructor(id: number, player1Id: number, player2Id: number, ws1: WebSocket, ws2: WebSocket) {
    this._id = id;
    this._players = new Map([
      [player1Id, { ws: ws1, id: player1Id, ships: [], shipsRes: [] }],
      [player2Id, { ws: ws2, id: player2Id, ships: [], shipsRes: [] }],
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

  setShips = (playerId: number, ships: ShipsReq) => {
    const player = this._players.get(playerId);
    const createdShips = ships.map(
      (ship, index) => new Ship(ship.position, ship.length, ship.direction, index)
    );

    if (player) {
      player.ships = createdShips;
      player.shipsRes = ships;
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
      const data = JSON.stringify({ ships: player.shipsRes, currentPlayerIndex: player.id });
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

  getOpponentId = (currPlayerId: number) => {
    const ids = this.getAllPlayersIds();
    return ids.find((id) => id !== currPlayerId);
  };

  switchTurn = () => {
    const turn = this.getOpponentId(this._turn);

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

  createAttackResponse = (x: number, y: number, currentPlayer: number, status: string) => {
    const data = { position: { x, y }, currentPlayer, status };

    const attackResponse: RequestResponse = {
      type: 'attack',
      data: JSON.stringify(data),
      id: 0,
    };

    return attackResponse;
  };

  createFinishResponse = (winPlayer: number) => {
    const finishResponse: RequestResponse = {
      type: 'finish',
      data: JSON.stringify({
        winPlayer,
      }),
      id: 0,
    };

    return finishResponse;
  };

  createAttackResponses = (
    x: number,
    y: number,
    currentPlayer: number,
    status: string,
    shipId: number,
    ships: Ship[],
    shouldFinish: boolean
  ) => {
    const mainResponse = this.createAttackResponse(x, y, currentPlayer, status);
    const attackResponses: RequestResponse[] = [mainResponse];

    if (status === 'killed' && shipId >= 0) {
      const ship = ships[shipId];
      const cellsAround = ship.getCellsArround();

      cellsAround.forEach((cell) => {
        const response = this.createAttackResponse(cell.x, cell.y, currentPlayer, 'miss');
        attackResponses.push(response);
      });

      if (shouldFinish) {
        const finishResponse = this.createFinishResponse(currentPlayer);

        attackResponses.push(finishResponse);
      }
    }

    return attackResponses;
  };

  isFinish = (ships: Ship[]) => {
    return ships.every((ship) => ship.getShipStatus() === 'killed');
  };

  attack = (winners: WinnersService, indexPlayer: number, x: number, y: number) => {
    const result: HandlerReturnType = [];

    if (this._turn === indexPlayer) {
      const opponentId = this.getOpponentId(indexPlayer);

      if (opponentId) {
        const currentPlayer = this._players.get(indexPlayer);
        const opponent = this._players.get(opponentId);

        if (opponent && currentPlayer) {
          const statuses = opponent.ships.map((ship) => ship.getAttackStatus(x, y));

          const status = statuses.find((status) => status.attackStatus !== 'miss') ?? {
            shipId: -1,
            attackStatus: 'miss',
            shipStatus: 'alive',
          };

          const shouldFinish = this.isFinish(opponent.ships);

          const attackResponses = this.createAttackResponses(
            x,
            y,
            indexPlayer,
            status.attackStatus,
            status.shipId,
            opponent.ships,
            shouldFinish
          );

          if (status.attackStatus === 'miss') {
            this.switchTurn();
          }

          const turnResponse = this.getTurnResp();

          result.push(
            { ws: currentPlayer.ws, responses: [...attackResponses, turnResponse] },
            { ws: opponent.ws, responses: [...attackResponses, turnResponse] }
          );

          if (shouldFinish) {
            const winnersResponses = winners.updateWinnersOnFinish(currentPlayer.ws);
            result.push(...winnersResponses);
          }
        }
      }
    }

    return result;
  };
}
