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
    return this._player1;
  };

  setPlayer2 = (player: User) => {
    this._player2 = player;
    return this._player2;
  };

  setPlayer = (player: User) => {
    const activePlayer = this.getActivePlayer();

    if (this.isFull() || activePlayer?.index === player.index) {
      return;
    }

    return this._player1 ? this.setPlayer2(player) : this.setPlayer1(player);
  };

  isFull = () => this._player1 && this._player2;

  getActivePlayer = () => this._player1 ?? this._player2;

  getPlayers = () => {
    return {
      player1: this._player1,
      player2: this._player2,
    };
  };
}
