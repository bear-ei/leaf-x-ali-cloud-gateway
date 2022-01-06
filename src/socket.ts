import {FetchOptions, handleRequestUrl} from '@leaf-x/fetch';
import * as uuid from 'uuid';
import {GatewayOptions} from './gateway';
import {headers as globalHeaders, initGetRequestHeaders} from './headers';

/**
 * Enumerate the socket command word.
 */
export enum CommandWord {
  /**
   * The API gateway returns a registration failure response.
   */
  RF = 'rf',

  /**
   * The client request volume reaches the API gateway flow control threshold,
   * the API gateway will send this command to the client, which requires the
   * client to actively disconnect and actively reconnect. Active reconnection
   * will not affect user experience. Otherwise, the API gateway will actively
   * disconnect the long connection soon after.
   */
  OS = 'os',

  /**
   * When the connection reaches the long connection lifecycle, the API gateway
   * will send this command to the client, requiring the client to actively
   * disconnect and actively reconnect. Active reconnection will not affect user
   * experience. Otherwise, the API gateway will actively disconnect the long
   * connection soon after.
   */
  CR = 'cr',

  /**
   * When the DeviceId registration is successful, the API gateway returns
   * success and the connection unique identifier and heartbeat interval
   * configuration.
   */
  RO = 'ro',

  /**
   * The API gateway returns a heartbeat hold success response signal.
   */
  HO = 'ho',

  /**
   * The API gateway returns a heartbeat hold failure response, which requires
   * the client to resend the registration request.
   */
  HF = 'hf',

  /**
   * The API gateway sends a downlink notification request.
   */
  NF = 'nf',
}

/**
 * Socket command word string.
 */
export type CommandWordString = 'RF' | 'OS' | 'CR' | 'RO' | 'HO' | 'HF' | 'NF';

/**
 * Enumerate the response event.
 */
export enum ResponseEvent {
  /**
   * Sign up event.
   */
  SIGN_UP = 'signUp',

  /**
   * Sign out event.
   */
  SIGN_OUT = 'signOut',
}

/**
 * Enumerate the response event string.
 */
export type ResponseEventString = 'SIGN_UP' | 'SIGN_OUT';

/**
 * Socket event.
 */
export type Event =
  | 'OPEN'
  | 'CLOSE'
  | 'MESSAGE'
  | 'ERROR'
  | 'SIGN_UP'
  | 'SIGN_OUT'
  | 'HEARTBEAT'
  | 'RECONNECT'
  | 'SEND';

/**
 * The result of the socket API.
 */
export interface SocketResult {
  /**
   * connect socket.
   */
  readonly connect: () => void;

  /**
   * close socket.
   */
  readonly close: () => void;

  /**
   * Listen to socket events.
   */
  readonly on: OnSocket;

  /**
   * Send socket message.
   */
  readonly send: SendSocket;
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
 * The function to initialize the socket.
 *
 * @param options GatewayOptions
 * @return Socket
 */
export interface InitSocket {
  (options: GatewayOptions): Socket;
}

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
 * Handle message.
 *
 * @param message The socket sends a message.
 * @return void
 */
export interface HandleMessage {
  (message: unknown): void;
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
  type?: 'UNREGISTER' | 'REGISTER';

  /**
   * Socket protocol.
   */
  protocol: 'ws' | 'wss';
}

/**
 * Send socket options.
 */
export interface SendSocketOptions {
  /**
   * Socket message.
   */
  message?: string | Record<string, unknown>;

  /**
   * SocketRequestOptions['type']
   */
  type?: SocketRequestOptions['type'];

  /**
   * Request path.
   */
  path?: string;
}

/**
 * Send socket message.
 *
 * @param message Send a message.
 * @return void
 */
export interface SendSocket {
  (event: string, options?: SendSocketOptions): void;
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

/**
 * Initialize the function that gets the socket request message.
 *
 * @param options GatewayOptions
 * @return GetSocketRequestMessage
 */
export interface InitGetSocketRequestMessage {
  (options: GatewayOptions): GetSocketRequestMessage;
}

export const initSocket: InitSocket = ({
  socketOptions = {},
  ...gatewayOptionsArgs
}) => {
  const {
    host = 'localhost',
    protocol = 'ws',
    port = 8080,
    signUpPath,
    signOutPath,
    deviceId = `${uuid.v4().replace(new RegExp('-', 'g'), '')}@${
      gatewayOptionsArgs.appKey
    }`,
  } = socketOptions as SocketOptions;

  let socket!: WebSocket;
  let seq = -1;
  let heartTimer!: NodeJS.Timeout;
  let reconnectTimer!: NodeJS.Timeout;
  let heartbeatInterval!: number;
  let heartNumber = 0;
  let online = false;

  const getSocketRequestMessage =
    initGetSocketRequestMessage(gatewayOptionsArgs);

  const events = {} as Record<string, Function[]>;
  const on: OnSocket = (event, callback) => {
    events[event] = events[event] ?? [];
    events[event].push(callback);
  };

  const emit: EmitSocket = (event, ...args) =>
    events[event] && events[event].forEach(fun => fun.apply(fun, args));

  return () => {
    const handleMessage: HandleMessage = message => {
      let data!: unknown;

      try {
        data = JSON.parse(message as string);
      } catch (error) {
        data = message;
      }

      const event = Object.freeze({
        signUp: (sequence: string) => {
          if (socket.readyState === socket.OPEN) {
            heartTimer = setInterval(() => {
              if (heartNumber % 2 === 0) {
                send('H1');

                heartNumber++;
              } else {
                reconnect();
              }
            }, heartbeatInterval);
          }

          online = true;

          emit(
            'SIGN_UP',
            `The gateway with sequence ${sequence} is signed up successfully.`
          );
        },
        signOut: (sequence: string) => {
          online = false;
          socket.close(1000);

          emit(
            'SIGN_OUT',
            `The gateway with sequence ${sequence} is signed out successfully.`
          );
        },
      });

      const isObject = typeof data === 'object' && data !== null;

      if (isObject) {
        const {status, body, header} = data as Record<string, unknown>;
        const handleEvent = event[ResponseEvent[body as ResponseEventString]];

        status === 200 && handleEvent
          ? handleEvent((header as Record<string, string>)['x-ca-seq'])
          : emit('ERROR', data);
      } else {
        emit('MESSAGE', data);
      }
    };

    const reset = () => {
      clearInterval(heartTimer);
      clearTimeout(reconnectTimer);

      online = false;
      heartNumber = 0;
      heartbeatInterval = 0;
    };

    const send: SendSocket = (event, options = {}) => {
      const {message = '', type, path} = options;

      if (socket.readyState === socket.OPEN) {
        const data =
          typeof message === 'string' && message
            ? message
            : JSON.stringify(message);

        const messageEvent = event === 'MESSAGE';

        if (messageEvent && !path) {
          throw new Error('Missing send event path.');
        }

        const sendMessage = messageEvent
          ? getSocketRequestMessage(path as string, {
              protocol,
              type,
              method: 'POST',
              data,
              host,
              seq,
            })
          : `${event}${message}`;

        socket.send(sendMessage);

        emit('SEND', sendMessage);
      } else {
        reconnect();

        emit('ERROR', {type: 'send', message});
      }
    };

    const connect = () => {
      socket = new WebSocket(`${protocol}://${host}:${port}`);

      onSocket();
    };

    const reconnect = () => {
      emit('RECONNECT', 'Try to re-establish the connection.');
      close();
      connect();
    };

    const close = () => {
      if (socket.readyState === socket.OPEN) {
        online
          ? send('MESSAGE', {path: signOutPath, type: 'UNREGISTER'})
          : socket.close(1000);
      }

      reset();
    };

    const onSocket = () => {
      socket.onopen = () => {
        if (socket.readyState === socket.OPEN) {
          seq++;

          send('RG#', {message: deviceId});
          emit(
            'OPEN',
            'The connection has been established and is ready for communication.'
          );
        }
      };

      socket.onerror = error => {
        const isDisconnect =
          socket.readyState === socket.CLOSED ||
          socket.readyState === socket.CLOSING;

        if (isDisconnect) {
          clearTimeout(reconnectTimer);

          reconnectTimer = setTimeout(() => reconnect(), 3000);
        }

        emit('ERROR', error);
      };

      socket.onmessage = messageEvent => {
        const event = Object.freeze({
          rf: reconnect,
          os: reconnect,
          cr: reconnect,
          hf: reconnect,
          ro: (message: string): void => {
            const [, , heartbeatTime] = message.split('#');

            heartbeatInterval = Number(heartbeatTime);

            send('MESSAGE', {path: signUpPath, type: 'REGISTER'});
          },
          ho: () => {
            heartNumber++;

            emit('HEARTBEAT', 'Maintaining a successful heartbeat.');
          },
          nf: (message: string): void => {
            send('NO');
            emit('MESSAGE', message.slice(3));
          },
        });

        const data = messageEvent.data;
        const signal = data?.slice(0, 2) as CommandWordString;
        const handEvent = event[CommandWord[signal]];

        handEvent ? handEvent(data) : handleMessage(data);
      };

      socket.onclose = () => {
        emit('CLOSE', 'Close the connection successfully.');
      };
    };

    return {connect, close, on, send};
  };
};

const initGetSocketRequestMessage: InitGetSocketRequestMessage =
  options =>
  (path, {type, protocol, seq, method, data = {}, host, params = {}}) => {
    const url = `${protocol}://${host}${path}`;
    const requestUrl = handleRequestUrl({url, params});
    const addHeaders = {} as Record<string, string>;
    const body =
      typeof data === 'object' && data !== null ? JSON.stringify(data) : data;

    for (const key of globalHeaders.keys()) {
      Object.assign(addHeaders, {[key]: globalHeaders.get(key)});
    }

    const headers = initGetRequestHeaders(options)({
      method,
      url: requestUrl,
      data: body,
      host,
      headers: {
        ca_version: '1',
        'x-ca-seq': `${seq}`,
        ...(type ? {'x-ca-websocket_api_type': type} : undefined),
        ...addHeaders,
      },
    });

    return JSON.stringify({
      isBase64: 0,
      method,
      body,
      host,
      path,
      headers: Object.keys(headers)
        .map(key => ({[key]: [headers[key]]}))
        .reduce((a, b) => Object.assign(a, b), {}),
    });
  };
