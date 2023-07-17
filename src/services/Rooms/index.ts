import DB from '../../db';
import { Room } from '../Room';
import type { WebSocket } from 'ws';
import type { RequestResponse } from '../../models/common';
import type { AvailableRooms } from '../../models/room';
import { REQ_RES_TYPES } from '../../constants';
import { GamesService } from '../Games';
import type { Handler, HandlerReturnType } from '../../types';

export class RoomsService {
  private _rooms: Map<number, Room>;
  private _roomId: number;
  private _db: DB;
  private _games: GamesService;

  constructor(db: DB, games: GamesService) {
    this._db = db;
    this._rooms = new Map();
    this._roomId = 1;
    this._games = games;
  }

  createRoom: Handler = (_, ws) => {
    const webSockets = this._db.getAllWebSockets();
    this.addRoom(ws);
    const updatedRoom = this.updateRoom();
    const responses = [updatedRoom];
    const result: HandlerReturnType = [];

    for (const ws of webSockets) {
      result.push({ ws, responses });
    }

    return result;
  };

  addRoom = (ws: WebSocket) => {
    const room = new Room();
    const player1 = this._db.getUser(ws);

    if (player1) {
      room.setPlayer1(player1);
    }

    this._rooms.set(this._roomId++, room);
  };

  updateRoom = () => {
    const data: AvailableRooms = [];

    this._rooms.forEach((room, id) => {
      const isFull = room.isFull();
      const player = room.getActivePlayer();

      if (!isFull && player) {
        const dataItem = {
          roomId: id,
          roomUsers: [
            {
              name: player.name,
              index: player.index,
            },
          ],
        };
        data.push(dataItem);
      }
    });

    const result: RequestResponse = {
      type: REQ_RES_TYPES.UPDATE_ROOM,
      data: JSON.stringify(data),
      id: 0,
    };

    return result;
  };

  addUserToRoom: Handler = (req, ws) => {
    const { indexRoom }: { indexRoom: number } = JSON.parse(req.data);
    const user = this._db.getUser(ws);
    const room = this._rooms.get(indexRoom);
    const result: HandlerReturnType = [];

    if (room && user) {
      room.setPlayer(user);
      const { player1, player2 } = room.getPlayers();

      if (player1 && player2) {
        const gameResp = this._games.createGame(
          player1.ws,
          player2.ws,
          player1.index,
          player2.index
        );

        const player1Resp = gameResp.get(player1.index);
        const player2Resp = gameResp.get(player2.index);

        if (player1Resp && player2Resp) {
          const updateResp = this.updateRoom();

          result.push({ ws: player1.ws, responses: [player1Resp, updateResp] });
          result.push({ ws: player2.ws, responses: [player2Resp, updateResp] });
        }
      }
    }

    return result;
  };

  getSize = () => {
    return this._rooms.size;
  };
}
