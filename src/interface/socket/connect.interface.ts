import {GatewayOptions} from '../gateway.interface';

export interface InitSocketConnectOptions {
  ssl: boolean;
  host: string;
  port: number;
}

export interface InitSocketConnect {
  (options: GatewayOptions): SocketConnect;
}

export interface SocketConnect {
  (deviceId: string, options: InitSocketConnectOptions): void;
}
