import {handleRequestUrl} from '@leaf-x/fetch';
import * as uuid from 'uuid';
import {CommandWord, CommandWordString} from './enum/socket.enum';
import {initGetRequestHeaders} from './headers';
import {
  EmitSocket,
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

  const getRequestMessage = initGetSocketRequestMessage(gatewayOptionsArgs);
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
      const message = getRequestMessage(signUpPath, {
        protocol,
        type: 'REGISTER',
        method: 'POST',
        host,
        seq,
      });

      socket.send(message);
      signUpStatus = true;

      emit('signUp', {
        success: true,
        message: 'Gateway sign up is successful.',
      });
    }
  };

  const signOut = () => {
    if (signUpStatus) {
      const message = getRequestMessage(signOutPath, {
        protocol,
        type: 'UNREGISTER',
        method: 'POST',
        host,
        seq,
      });

      socket.send(message);
      signUpStatus = false;

      emit('signOut', {
        success: true,
        message: 'Gateway sign out is successful.',
      });
    }
  };

  const send: SendSocket = message => {
    const data =
      typeof message === 'string' ? message : JSON.stringify(message);

    socket.send(data);
  };

  return () => {
    const connect = () => {
      seq++;
      socket = new WebSocket(`${protocol}://${host}:${port}`);

      onSocket();
    };

    const reconnect = () => {
      if (signUpStatus && socket.readyState === 1) {
        signOut();
      }

      close();
      connect();
    };

    const close = () => {
      signOut();

      socket.close();
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

      socket.onmessage = (messageEvent: MessageEvent) => {
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

        const data = messageEvent.data as string;
        const signal = data?.slice(0, 2) as CommandWordString;

        event[CommandWord[signal]](data);
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
  (path, {type, protocol, seq, method, data, host, params = {}}) => {
    const url = `${protocol}://${host}${path}`;
    const requestUrl = handleRequestUrl({url, params});
    const headers = initGetRequestHeaders(options)({
      url: requestUrl,
      data,
      host,
      headers: {'x-ca-seq': `${seq}`, 'x-ca-websocket_api_type': type},
    });

    return JSON.stringify({method, data, host, path, headers});
  };
