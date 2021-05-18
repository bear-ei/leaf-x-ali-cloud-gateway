import {FetchOptions} from '@leaf-x/fetch';
import {GatewayOptions} from '../gateway.interface';

export interface InitSocketSignOut {
  (options: GatewayOptions): SocketSignOut;
}

export interface SocketSignOutOptions extends FetchOptions {
  host: string;
  path: string;
}

export interface SocketSignOut {
  (url: string, options: SocketSignOutOptions): void;
}
