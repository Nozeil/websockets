import { Routes } from '../controller/index.types';
import DB from '../db';
import { RegService } from './Reg';
import { Rooms } from './Room';

export class Services {
  reg: RegService;
  rooms: Rooms;

  constructor(db: InstanceType<typeof DB>) {
    this.reg = new RegService(db);
    this.rooms = new Rooms();
  }

  createRoutes = () => {
    const routes: Routes = [
      ['reg', (req, ws) => this.reg.createUser(req, ws)],
      /* ['create_room', (req) => this.rooms.createRoom(req)], */
    ];
    return routes;
  };
}
