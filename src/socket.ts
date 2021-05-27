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
  HandleOtherMessage,
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
    host,
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
  let heartNumber = 0;
  let signUpStatus = false;

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

  const signUp = () => {
    if (!signUpStatus) {
      const message = getSocketRequestMessage(signUpPath, {
        protocol,
        type: 'REGISTER',
        method: 'POST',
        host,
        seq,
      });

      socket.send(message);
    }
  };

  const signOut = () => {
    if (signUpStatus) {
      const message = getSocketRequestMessage(signOutPath, {
        protocol,
        type: 'UNREGISTER',
        method: 'POST',
        host,
        seq,
      });

      socket.send(message);
    }
  };

  const send: SendSocket = message => {
    const data =
      typeof message === 'string' ? message : JSON.stringify(message);

    socket.send(data);
  };

  const handleOtherMessage: HandleOtherMessage = message => {
    let data!: unknown;

    try {
      data = JSON.parse(message as string);
    } catch (error) {
      data = message;
    }

    const event = Object.freeze({
      signUp: () => {
        signUpStatus = true;

        emit('signUp', {
          success: true,
          message: 'Gateway sign up is successful.',
        });
      },
      signOut: () => {
        signUpStatus = false;

        emit('signOut', {
          success: true,
          message: 'Gateway sign out is successful.',
        });

        socket.close();
      },
    });

    if (typeof data === 'object' && data !== null) {
      const {status, body} = data as Record<string, unknown>;
      const handleEvent = event[ResponseEvent[body as ResponseEventString]];

      status === 200 && handleEvent ? handleEvent() : emit('error', data);
    } else {
      emit('message', data);
    }
  };

  return () => {
    const connect = () => {
      seq++;
      socket = new WebSocket(`${protocol}://${host}:${port}`);

      onSocket();
    };

    const reconnect = () => {
      emit('reconnect', 'Try to re-establish the connection.');

      close();
      connect();
    };

    const close = () => {
      if (socket.readyState === 1) {
        signUpStatus ? signOut() : socket.close();
      }
    };

    const onSocket = () => {
      socket.onopen = () => {
        if (socket.readyState === 1) {
          clearInterval(reconnectTimer);

          socket.send(`RG#${deviceId}`);

          emit('open', {
            success: true,
            message:
              'The connection has been established and is ready for communication.',
          });
        }
      };

      socket.onerror = error => {
        if (socket.readyState === 3) {
          reconnectTimer = setInterval(() => reconnect(), 10 * 1000);
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
            const [, , heartbeatInterval] = message.split('#');

            heartTimer = setInterval(() => {
              if (heartNumber % 2 === 0) {
                heartNumber++;
                socket.send('H1');
              } else {
                reconnect();
              }
            }, Number(heartbeatInterval));

            signUp();
          },
          ho: () => {
            heartNumber++;

            emit('heartbeat', {
              success: true,
              message: 'Maintaining a successful heartbeat.',
            });
          },
          nf: (message: string): void => {
            emit('message', message.slice(3));

            socket.send('NO');
          },
        });

        const data = messageEvent.data;
        const signal = data?.slice(0, 2) as CommandWordString;
        const handEvent = event[CommandWord[signal]];

        console.info(data);

        handEvent ? handEvent(data) : handleOtherMessage(data);
      };

      socket.close = () => {
        clearInterval(heartTimer);

        heartNumber = 0;

        emit('close', {
          success: true,
          message: 'Connection is closed.',
        });
      };
    };

    return {connect, reconnect, close, on, emit, send};
  };
};

const initGetSocketRequestMessage: InitGetSocketRequestMessage =
  options =>
  (path, {type, protocol, seq, method, data = {}, host, params = {}}) => {
    const url = `${protocol}://${host}${path}`;
    const requestUrl = handleRequestUrl({url, params});
    const addHeaders = {} as Record<string, string>;

    for (const key of globalHeaders.keys()) {
      Object.assign(addHeaders, {[key]: globalHeaders.get(key)});
    }

    const headers = initGetRequestHeaders(options)({
      method,
      url: requestUrl,
      data,
      host,
      headers: {
        'x-ca-seq': `${seq}`,
        'x-ca-websocket_api_type': type,
        ...addHeaders,
      },
    });

    return JSON.stringify({
      method,
      body: JSON.stringify(data),
      host,
      path,
      headers: Object.keys(headers)
        .map(key => ({[key]: [headers[key]]}))
        .reduce((a, b) => Object.assign(a, b), {}),
    });
  };
