import type { Ships } from '../types';

export interface AddShips {
  gameId: number;
  ships: Ships;
  indexPlayer: number;
}
