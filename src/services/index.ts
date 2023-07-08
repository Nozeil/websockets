import { Routes } from '../controller/index.types';
import DB from '../db';
import { RegService } from './Reg';

export class Services {
  db: DB;
  reg: RegService;

  constructor() {
    this.db = new DB();
    this.reg = new RegService(this.db);
  }

  createRoutes = () => {
    const routes: Routes = [['reg', (req) => this.reg.createUser(req)]];
    return routes;
  };
}
