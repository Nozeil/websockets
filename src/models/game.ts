interface ShipReq {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export type ShipsReq = ShipReq[];

export interface AddShips {
  gameId: number;
  ships: ShipsReq;
  indexPlayer: number;
}

export interface AttackReq {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
}
export interface AttackRes {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: number;
  status: 'miss' | 'killed' | 'shot';
}
