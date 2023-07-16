interface Pos {
  x: number;
  y: number;
}

export class Ship {
  private _hp: number;
  private _direction: boolean;
  private _initialX: number;
  private _initialY: number;
  private _coordinates: Pos[];
  private _status: 'alive' | 'killed';
  private _cellsAround: Pos[];
  private _shipId: number;

  constructor(pos: Pos, length: number, direction: boolean, shipId: number) {
    this._initialX = pos.x;
    this._initialY = pos.y;
    this._direction = direction;
    this._coordinates = this.setCoordinates(length);
    this._cellsAround = this.setCellsAround();
    this._hp = this._coordinates.length;
    this._status = 'alive';
    this._shipId = shipId;
  }

  getCoordinates = () => {
    return this._coordinates;
  };

  setCoordinates = (length: number) => {
    const initialCoordinates = new Array(length).fill(null);

    let x = this._initialX;
    let y = this._initialY;

    const coordinates = initialCoordinates.map(() =>
      this._direction ? { x, y: y++ } : { x: x++, y }
    );

    return coordinates;
  };

  getCellsArround = () => {
    return this._cellsAround;
  };

  setCellsAround = () => {
    const cells: Pos[] = [];
    const maxX = 9;
    const maxY = 9;

    this._coordinates.forEach((coordinate, index, arr) => {
      const x = coordinate.x;
      const y = coordinate.y;

      if (this._direction) {
        if (!index && y) {
          cells.push({ x: x - 1, y: y - 1 });
          cells.push({ x, y: y - 1 });
          cells.push({ x: x + 1, y: y - 1 });
        }

        if (index === arr.length - 1 && y !== maxY) {
          cells.push({ x: x - 1, y: y + 1 });
          cells.push({ x, y: y + 1 });
          cells.push({ x: x + 1, y: y + 1 });
        }

        if (x) {
          cells.push({ x: x - 1, y });
        }

        if (x !== maxX) {
          cells.push({ x: x + 1, y });
        }
      } else {
        if (!index && x) {
          cells.push({ x: x - 1, y: y - 1 });
          cells.push({ x: x - 1, y });
          cells.push({ x: x - 1, y: y + 1 });
        }

        if (index === arr.length - 1 && x !== maxX) {
          cells.push({ x: x + 1, y: y - 1 });
          cells.push({ x: x + 1, y });
          cells.push({ x: x + 1, y: y + 1 });
        }

        if (y) {
          cells.push({ x, y: y - 1 });
        }

        if (y !== maxY) {
          cells.push({ x, y: y + 1 });
        }
      }
    });

    return cells;
  };

  decreaseHp = () => {
    this._hp--;
  };

  isShipStrike = (x: number, y: number) => {
    return this._coordinates.some((coordinate) => coordinate.x === x && coordinate.y === y);
  };

  getAttackStatus = (x: number, y: number) => {
    const isStrike = this.isShipStrike(x, y);
    const status = { shipId: this._shipId, attackStatus: 'miss', shipStatus: this._status };

    if (isStrike) {
      this.decreaseHp();

      if (this._hp) {
        status.attackStatus = 'shot';
      } else {
        this._status = status.shipStatus = status.attackStatus = 'killed';
      }
    }

    return status;
  };

  getShipStatus = () => {
    return this._status;
  };
}
