import { WebSocket } from 'ws';
import DB from '../../db';
import { RequestResponse } from '../../models/common';
import { RegData } from '../../models/reg';

export class RegService {
  db: DB;

  constructor(db: DB) {
    this.db = db;
  }

  isValidUser = ({ name, password }: RegData) => name.length >= 5 && password.length >= 5;

  createUser = ({ type, data, id }: RequestResponse, ws: WebSocket) => {
    const userData: RegData = JSON.parse(data);
    const isValid = this.isValidUser(userData);

    const resData = {
      name: userData.name,
      index: isValid ? this.db.setUser(ws, userData) : -1,
      error: !isValid,
      errorText: isValid ? '' : 'Name or password length should be not less than 5',
    };
    const stringifyedResData = JSON.stringify(resData);
    const res: RequestResponse = {
      type,
      id,
      data: stringifyedResData,
    };
    return res;
  };
}
