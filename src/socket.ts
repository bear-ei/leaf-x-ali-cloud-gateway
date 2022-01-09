import {FetchOptions, handleRequestUrl} from '@leaf-x/fetch';
import {Base64} from 'js-base64';
import * as uuid from 'uuid';
import {GatewayOptions} from './gateway';
import {headers as globalHeaders, initHandleRequestHeaders} from './headers';

/**
 * Socket command word enumeration.
 */
export enum CommandWord {
  /**
   * The API gateway returns a registration failure response.
   */
  RF = 'rf',

  /**
   * When the client request volume reaches the API gateway flow control
   * threshold, the API gateway will send this command to the client, requiring
   * the client to actively disconnect and actively reconnect. Active
   * reconnection will not affect user experience. Otherwise, the API gateway
   * will actively disconnect the long connection soon after.
   */
  OS = 'os',

  /**
   * When the connection reaches the long connection lifecycle, the API gateway
   * will send this command to the client, which requires the client to actively
   * disconnect and actively reconnect. Active reconnection will not affect the
   * user experience. Otherwise, the API gateway will actively disconnect the
   * long connection shortly afterwards.
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
   * TThe API gateway sends a downlink notification request.
   */
  NF = 'nf',
}

/**
 * Socket command word string.
 */
export type CommandWordString = 'RF' | 'OS' | 'CR' | 'RO' | 'HO' | 'HF' | 'NF';

/**
 * Response event enumeration.
 */
export enum ResponseEvent {
  SIGN_UP = 'signUp',
  SIGN_OUT = 'signOut',
}

/**
 * Response event string.
 */
export type ResponseEventString = 'SIGN_UP' | 'SIGN_OUT';

/**
 * Listening to events.
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
 * API gateway socket options.
 */
export interface SocketOptions {
  /**
   * Sign up path.
   */
  signUpPath: string;

  /**
   * Sign out path.
   */
  signOutPath: string;

  /**
   * API gateway host address.
   */
  host?: string;

  /**
   * Socket protocol.
   */
  protocol?: 'wss' | 'ws';

  /**
   * API Gateway port.
   */
  port?: number;

  /**
   * Client device ID.
   */
  deviceId?: string;
}

/**
 * Socket request option.
 */
export interface SocketRequestOptions extends FetchOptions {
  /**
   * API gateway host address.
   */
  host: string;

  /**
   * Request sequence.
   */
  seq: number;

  /**
   * Request type. UNREGISTER is sign oul, REGISTER is sign up.
   */
  type?: 'UNREGISTER' | 'REGISTER';

  /**
   * Socket protocol.
   */
  protocol: 'ws' | 'wss';
}

export interface SendSocketOptions {
  /**
   * Send a message.
   */
  message?: string | Record<string, unknown>;

  /**
   * Request type. UNREGISTER is sign oul, REGISTER is sign up.
   */
  type?: SocketRequestOptions['type'];

  /**
   * Send message path.
   */
  path?: string;
}

/**
 * Socket.
 *
 * @param options API gateway options.
 */
const socket = ({socketOptions, ...gatewayOptionsArgs}: GatewayOptions) => {
  let webSocket!: WebSocket;
  let seq = -1;
  let heartTimer!: NodeJS.Timeout;
  let reconnectTimer!: NodeJS.Timeout;
  let heartbeatInterval!: number;
  let heartNumber = 0;
  let online = false;

  const {
    host = 'localhost',
    protocol = 'ws',
    port = 8080,
    signUpPath = '',
    signOutPath = '',
    deviceId = `${uuid.v4().replace(/-/g, '')}@${gatewayOptionsArgs.appKey}`,
  } = socketOptions ?? {};

  const socketRequestMessage =
    initHandleSocketRequestMessage(gatewayOptionsArgs);

  const events = {} as Record<string, Function[]>;
  const on = (event: Event, fun: Function) => {
    events[event] = events[event] ?? [];
    events[event].push(fun);
  };

  const emit = (event: Event, ...args: unknown[]) =>
    events[event] && events[event].forEach(fun => fun.apply(fun, args));

  const handleMessage = (message: unknown) => {
    let data!: unknown;

    try {
      data = JSON.parse(message as string);
    } catch (error) {
      data = message;
    }

    const event = Object.freeze({
      signUp: (sequence: string) => {
        if (webSocket.readyState === webSocket.OPEN) {
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
        webSocket.close(1000);

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

  const send = (event: string, options: SendSocketOptions = {}) => {
    const {message = '', type, path = ''} = options;
    const execSend = () => {
      const data =
        typeof message === 'string' && message
          ? message
          : JSON.stringify(message);

      const messageEvent = event === 'MESSAGE';

      if (messageEvent && !path) {
        throw new Error('Missing send event path.');
      }

      const sendMessage = messageEvent
        ? socketRequestMessage(path, {
            protocol,
            type,
            method: 'POST',
            data,
            host,
            seq,
          })
        : `${event}${message}`;

      webSocket.send(sendMessage);

      emit('SEND', sendMessage);
    };

    const execReconnect = () => {
      reconnect();

      emit('ERROR', {type: 'send', message});
    };

    webSocket.readyState === webSocket.OPEN ? execSend() : execReconnect();
  };

  const connect = () => {
    webSocket = new WebSocket(`${protocol}://${host}:${port}`);

    onSocket();
  };

  const reconnect = () => {
    emit('RECONNECT', 'Try to re-establish the connection.');
    close();
    connect();
  };

  const close = () => {
    if (webSocket.readyState === webSocket.OPEN) {
      online
        ? send('MESSAGE', {path: signOutPath, type: 'UNREGISTER'})
        : webSocket.close(1000);
    }

    reset();
  };

  const onSocket = () => {
    webSocket.onopen = () => {
      if (webSocket.readyState === webSocket.OPEN) {
        seq++;

        send('RG#', {message: deviceId});
        emit(
          'OPEN',
          'The connection has been established and is ready for communication.'
        );
      }
    };

    webSocket.onerror = error => {
      const isDisconnect =
        webSocket.readyState === webSocket.CLOSED ||
        webSocket.readyState === webSocket.CLOSING;

      if (isDisconnect) {
        clearTimeout(reconnectTimer);

        reconnectTimer = setTimeout(() => reconnect(), 3000);
      }

      emit('ERROR', error);
    };

    webSocket.onmessage = messageEvent => {
      const event = Object.freeze({
        rf: reconnect,
        os: reconnect,
        cr: reconnect,
        hf: reconnect,
        ro: (message: string) => {
          const [, , heartbeatTime] = message.split('#');

          heartbeatInterval = Number(heartbeatTime);

          send('MESSAGE', {path: signUpPath, type: 'REGISTER'});
        },
        ho: () => {
          heartNumber++;

          emit('HEARTBEAT', 'Maintaining a successful heartbeat.');
        },
        nf: (message: string) => {
          send('NO');
          emit('MESSAGE', message.slice(3));
        },
      });

      const data = messageEvent.data;
      const signal = data?.slice(0, 2) as CommandWordString;
      const handEvent = event[CommandWord[signal]];

      handEvent ? handEvent(data) : handleMessage(data);
    };

    webSocket.onclose = () => {
      emit('CLOSE', 'Close the connection successfully.');
    };
  };

  return {connect, close, on, send};
};

/**
 *  The function to initialize the socket.
 *
 * @param options API gateway options.
 */
export const initSocket = (options: GatewayOptions) => () => socket(options);

/**
 * Handle socket request messages.
 *
 * @param path Request path.
 * @param socketRequestOptions Socket request option.
 * @param options API gateway options.
 */
const handleSocketRequestMessage = (
  path: string,
  {type, protocol, seq, method, data, host, params = {}}: SocketRequestOptions,
  options: GatewayOptions
) => {
  const url = `${protocol}://${host}${path}`;
  const requestUrl = handleRequestUrl(url, {params});
  const addHeaders = {} as Record<string, string>;
  const body =
    typeof data === 'object' && data !== null ? JSON.stringify(data) : data;

  for (const key of globalHeaders.keys()) {
    Object.assign(addHeaders, {[key]: globalHeaders.get(key)});
  }

  const handleRequestHeaders = initHandleRequestHeaders(options);
  const headers = handleRequestHeaders({
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
    isBase64: 1,
    method,
    body: body ? Base64.encode(body) : body,
    host,
    path,
    headers: Object.keys(headers)
      .map(key => ({
        [key]: [headers[key as keyof typeof headers]],
      }))
      .reduce((a, b) => Object.assign(a, b), {}),
  });
};

/**
 * Initialize the function that handles socket request messages.
 *
 * @param gatewayOptions API gateway options.
 */
const initHandleSocketRequestMessage =
  (gatewayOptions: GatewayOptions) =>
  (path: string, options: SocketRequestOptions) =>
    handleSocketRequestMessage(path, options, gatewayOptions);
