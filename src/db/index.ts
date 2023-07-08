import type { ReqData } from '../models/reg';
import { User } from './index.types';

class DB {
  private _db: Map<number, User>;
  private _userIndex: number;

  constructor() {
    this._db = new Map();
    this._userIndex = 0;
  }

  private increaseIndex() {
    this._userIndex += 1;
  }

  setUser = ({ name, password }: ReqData) => {
    const index = this._userIndex;
    const user = { name, password, index };
    this._db.set(index, user);
    this.increaseIndex();
    return index;
  };
}

export default DB;
