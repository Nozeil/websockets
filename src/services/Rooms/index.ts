import DB from '../../db';
import { Room } from '../Room';
import type { WebSocket } from 'ws';
import type { RequestResponse } from '../../models/common';
import type { AvailableRooms } from '../../models/room';
import { REQ_RES_TYPES } from '../../constants';

export class RoomsService {
  private _rooms: Map<number, Room>;
  private _roomId: number;
  private _db: DB;

  constructor(db: DB) {
    this._db = db;
    this._rooms = new Map();
    this._roomId = 1;
  }

  createRoom = (_: RequestResponse, ws: WebSocket) => {
    this.addRoom(ws);
    const updatedRoom = this.updateRoom();
    const responses = [updatedRoom];

    return responses;
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

  addUserToRoom = (req: RequestResponse, ws: WebSocket) => {
    const { indexRoom }: { indexRoom: number } = JSON.parse(req.data);
    const user = this._db.getUser(ws);
    const room = this._rooms.get(indexRoom);
    const responses: RequestResponse[] = [];

    if (room && user) {
      const isSeted = room.setPlayer(user);
      if (isSeted) {
        responses.push(this.updateRoom());
      }
    }

    return responses;
  };

  getSize = () => {
    return this._rooms.size;
  };
}
