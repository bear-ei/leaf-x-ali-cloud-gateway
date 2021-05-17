import {FetchOptions} from '@leaf-x/fetch';
import {GatewayOptions} from '../gateway.interface';

export interface InitSocketSignUp {
  (options: GatewayOptions): SocketSignUp;
}

export interface SocketSignUpOptions extends FetchOptions {
  host: string;
  path: string;
}

export interface SocketSignUp {
  (url: string, options: SocketSignUpOptions): void;
}
