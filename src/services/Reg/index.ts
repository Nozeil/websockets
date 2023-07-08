import DB from '../../db';
import { RequestResponse } from '../../models/common';
import { ReqData } from '../../models/reg';

export class RegService {
  db: DB;

  constructor(db: DB) {
    this.db = db;
  }

  createUser = ({ type, data, id }: RequestResponse) => {
    const userData: ReqData = JSON.parse(data);
    const index = this.db.setUser(userData);
    const resData = {
      name: userData.name,
      index,
      error: false,
      errorText: '',
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
