import {FetchOptions} from '@leaf-x/fetch';
import {GatewayOptions} from '../gateway.interface';

export interface InitSocketSignOut {
  (options: GatewayOptions): SocketSignOut;
}

export interface SocketSignOutOptions extends FetchOptions {
  host?: string;
  seq: number;
}

export interface SocketSignOut {
  (url: string, options: SocketSignOutOptions): string;
}
