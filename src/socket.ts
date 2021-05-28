import {handleRequestUrl} from '@leaf-x/fetch';
import * as uuid from 'uuid';
import {
  CommandWord,
  CommandWordString,
  ResponseEvent,
  ResponseEventString,
} from './enum/socket.enum';
import {headers as globalHeaders, initGetRequestHeaders} from './headers';
import {
  EmitSocket,
  HandleMessage,
  InitGetSocketRequestMessage,
  InitSocket,
  OnSocket,
  SendSocket,
  SocketOptions,
} from './interface/socket.interface';

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

  let seq = -1;
  let heartTimer!: NodeJS.Timeout;
  let reconnectTimer!: NodeJS.Timeout;
  let socket!: WebSocket;
  let heartbeatInterval!: number;
  let heartNumber = 0;

  const getSocketRequestMessage =
    initGetSocketRequestMessage(gatewayOptionsArgs);

  const events = {} as Record<string, Function[]>;
  const on: OnSocket = (event, callback) => {
    events[event] = events[event] ?? [];
    events[event].push(callback);
  };

  const emit: EmitSocket = (event, ...args) => {
    if (events[event]) {
      for (const item of events[event]) {
        item.apply(item, args);
      }
    }
  };

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
          emit(
            'signUp',
            `The gateway with sequence ${sequence} is signed up successfully.`
          );

          heartTimer = setInterval(() => {
            if (heartNumber % 2 === 0) {
              send('H1');

              heartNumber++;
            } else {
              console.info('Local heartbeat maintenance failed.');
              reconnect();
            }
          }, heartbeatInterval);
        },
        signOut: (sequence: string) => {
          emit(
            'signOut',
            `The gateway with sequence ${sequence} is signed out successfully.`
          );
        },
      });

      const objectData = typeof data === 'object' && data !== null;

      if (objectData) {
        const {status, body, header} = data as Record<string, unknown>;
        const handleEvent = event[ResponseEvent[body as ResponseEventString]];

        status === 200 && handleEvent
          ? handleEvent((header as Record<string, string>)['x-ca-seq'])
          : emit('error', data);
      } else {
        emit('message', data);
      }
    };

    const reset = () => {
      clearInterval(heartTimer);

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

        const messageEvent = event === 'message';

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
      } else {
        reconnect();
      }
    };

    const connect = () => {
      socket = new WebSocket(`${protocol}://${host}:${port}`);

      onSocket();
    };

    const reconnect = () => {
      console.info('onreconnect', socket.readyState);
      emit('reconnect', 'Try to re-establish the connection.');
      close();
      connect();
    };

    const close = () => {
      console.info('ex-close', socket.readyState);
      if (socket.readyState === socket.OPEN) {
        send('message', {path: signOutPath, type: 'UNREGISTER'});

        socket.close();
      } else {
        reset();
      }
    };

    const onSocket = () => {
      socket.onopen = () => {
        console.info('onopen', socket.readyState);
        if (socket.readyState === socket.OPEN) {
          emit(
            'open',
            'The connection has been established and is ready for communication.'
          );

          seq++;

          send('RG#', {message: deviceId});
        }
      };

      socket.onerror = error => {
        console.info('onerror', socket.readyState);
        emit('error', error);
        if (socket.readyState === socket.CLOSED) {
          clearTimeout(reconnectTimer);

          reconnectTimer = setTimeout(() => reconnect(), 3000);
        }
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

            send('message', {path: signUpPath, type: 'REGISTER'});
          },
          ho: () => {
            emit('heartbeat', 'Maintaining a successful heartbeat.');

            heartNumber++;
          },
          nf: (message: string): void => {
            emit('message', message.slice(3));
            send('NO');
          },
        });

        const data = messageEvent.data;
        const signal = data?.slice(0, 2) as CommandWordString;
        const handEvent = event[CommandWord[signal]];

        console.info('onmessage', socket.readyState, data);

        handEvent ? handEvent(data) : handleMessage(data);
      };

      socket.close = () => {
        console.info('onclose', socket.readyState);
        emit('close', 'Connection is closed.');
        reset();
      };
    };

    return {connect, reconnect, close, on, send};
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
