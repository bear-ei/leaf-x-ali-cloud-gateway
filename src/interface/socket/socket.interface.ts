import {GatewayOptions} from '../gateway.interface';

export interface SocketOptions {
  signUpPath: string;
  signOutPath: string;
  host: string;
  secure?: boolean;
  port?: number;
  deviceId?: string;
}

export interface InitSocket {
  (options: GatewayOptions): Socket;
}

export interface Socket {
  (): any;
}
