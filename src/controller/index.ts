import { Services } from '../services';
import { RouterMap } from './index.types';

export class Controller {
  private _services: Services;
  private _router: RouterMap;

  constructor() {
    this._services = new Services();
    this._router = new Map(this._services.createRoutes());
  }

  getHandler = (type: string) => {
    return this._router.get(type);
  };
}
