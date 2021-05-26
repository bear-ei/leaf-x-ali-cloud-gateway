import {FetchOptions} from '@leaf-x/fetch';
import {GatewayOptions} from './gateway.interface';

/**
 * Options for the socket API.
 */
export interface SocketOptions {
  /**
   * Socket sign up path.
   */
  signUpPath: string;

  /**
   * Socket sign out path.
   */
  signOutPath: string;

  /**
   * Socket host.
   */
  host: string;

  /**
   * Socket protocol. Default is ws
   */
  protocol?: 'wss' | 'ws';

  /**
   * Socket port. Default is 8080
   */
  port?: number;

  /**
   * The device ID of the connected socket.
   */
  deviceId?: string;
}

/**
 * The function to initialize the socket.
 *
 * @param options GatewayOptions
 * @return Socket
 */
export interface InitSocket {
  (options: GatewayOptions): Socket;
}

/**
 * Socket event.
 */
export type Event =
  | 'open'
  | 'close'
  | 'message'
  | 'error'
  | 'signUp'
  | 'signOut'
  | 'heartbeat';

/**
 * The result of the socket API.
 */
export interface SocketResult {
  /**
   * connect socket.
   */
  readonly connect: () => void;

  /**
   * reconnect socket.
   */
  readonly reconnect: () => void;

  /**
   * close socket.
   */
  readonly close: () => void;

  /**
   * Listen to socket events.
   */
  readonly on: OnSocket;

  /**
   * Send socket event.
   */
  readonly emit: EmitSocket;

  /**
   * Send socket message.
   */
  readonly send: SendSocket;
}

/**
 * Listen to socket event.
 *
 * @param event Event
 * @param callback Function
 * @return void
 */
export interface OnSocket {
  (event: Event, callback: Function): void;
}

/**
 * Send socket event.
 *
 * @param event Event
 * @param options unknown
 * @return void
 */
export interface EmitSocket {
  (event: Event, options: unknown): void;
}

/**
 * Send socket message.
 *
 * @param message Send a message.
 * @return void
 */
export interface SendSocket {
  (message: string | Record<string, unknown>): void;
}

/**
 * Socket API.
 *
 * @return SocketResult
 */
export interface Socket {
  (): SocketResult;
}

/**
 * Initialize the function that gets the socket request message.
 *
 * @param options GatewayOptions
 * @return GetSocketRequestMessage
 */
export interface InitGetSocketRequestMessage {
  (options: GatewayOptions): GetSocketRequestMessage;
}

/**
 * Options for socket request.
 *
 * @extends FetchOptions
 */
export interface SocketRequestOptions extends FetchOptions {
  /**
   * Request host.
   */
  host: string;

  /**
   * Socket sequence.
   */
  seq: number;

  /**
   * Request type.
   */
  type: 'UNREGISTER' | 'REGISTER';

  /**
   * Socket protocol.
   */
  protocol: 'ws' | 'wss';
}

/**
 * Get the socket request message.
 *
 * @param url URL of the request.
 * @param options SocketRequestOptions
 * @return string
 */
export interface GetSocketRequestMessage {
  (url: string, options: SocketRequestOptions): string;
}
