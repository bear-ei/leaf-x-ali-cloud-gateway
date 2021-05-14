import {GatewayOptions} from '../gateway.interface';

export interface SocketOptions {
  host: string;
  signUpUrl: string;
  signOutUrl: string;
  ssl?: boolean;
  port?: number;
}

export interface InitSocket {
  (options: GatewayOptions): any;
}
