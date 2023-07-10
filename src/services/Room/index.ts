import type { User } from '../../db/index.types';

export class Room {
  private _player1: null | User;
  private _player2: null | User;

  constructor() {
    this._player1 = null;
    this._player2 = null;
  }

  setPlayer1 = (player: User) => {
    this._player1 = player;
  };

  setPlayer2 = (player: User) => {
    this._player2 = player;
  };

  isFull = () => this._player1 && this._player2;

  getActivePlayer = () => this._player1 ?? this._player2;
}
