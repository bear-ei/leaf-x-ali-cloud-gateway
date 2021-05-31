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
  let online = false;

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
            'signUp',
            `The gateway with sequence ${sequence} is signed up successfully.`
          );
        },
        signOut: (sequence: string) => {
          online = false;

          socket.close(1000);

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

        emit('send', message);
      } else {
        reconnect();

        emit('error', {type: 'send', message});
      }
    };

    const connect = () => {
      socket = new WebSocket(`${protocol}://${host}:${port}`);

      onSocket();
    };

    const reconnect = () => {
      emit('reconnect', 'Try to re-establish the connection.');
      close();
      connect();
    };

    const close = () => {
      console.info(socket.readyState, online);

      if (socket.readyState === socket.OPEN) {
        online
          ? send('message', {path: signOutPath, type: 'UNREGISTER'})
          : socket.close(1000);
      } else {
        reset();
      }
    };

    const onSocket = () => {
      socket.onopen = () => {
        if (socket.readyState === socket.OPEN) {
          seq++;

          send('RG#', {message: deviceId});
          emit(
            'open',
            'The connection has been established and is ready for communication.'
          );
        }
      };

      socket.onerror = error => {
        const disconnect =
          socket.readyState === socket.CLOSED ||
          socket.readyState === socket.CLOSING;

        if (disconnect) {
          clearTimeout(reconnectTimer);

          reconnectTimer = setTimeout(() => reconnect(), 3000);
        }

        emit('error', error);
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
            heartNumber++;

            emit('heartbeat', 'Maintaining a successful heartbeat.');
          },
          nf: (message: string): void => {
            send('NO');
            emit('message', message.slice(3));
          },
        });

        const data = messageEvent.data;
        const signal = data?.slice(0, 2) as CommandWordString;
        const handEvent = event[CommandWord[signal]];

        console.info(signal);

        handEvent ? handEvent(data) : handleMessage(data);
      };

      socket.onclose = () => {
        reset();
        emit('close', 'Close the connection successfully.');
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
