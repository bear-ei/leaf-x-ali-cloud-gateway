import {handleRequestUrl} from '@leaf-x/fetch';
import * as uuid from 'uuid';
import {CommandWord, CommandWordString} from './enum/socket.enum';
import {initGetRequestHeaders} from './headers';
import {
  InitSocket,
  InitSocketRequest,
  SocketOptions,
} from './interface/socket.interface';

export const initSocket: InitSocket = ({socketOptions = {}, ...args}) => {
  const {
    host,
    protocol = 'wss',
    port = 8080,
    signUpPath,
    signOutPath,
    deviceId = `${uuid.v4().replace(new RegExp('-', 'g'), '')}@${args.appKey}`,
  } = socketOptions as SocketOptions;

  const request = initSocketRequest(args);

  let seq = -1;
  let heartTimer!: NodeJS.Timeout;
  let socket!: WebSocket;
  let heartNumber = 0;
  let signUpStatus = false;

  return () => {
    const connect = () => {
      seq++;

      socket = new WebSocket(`${protocol}://${host}:${port}`);

      socket.onopen = () => {
        if (socket.readyState === 1) {
          socket.send(`RG#${deviceId}`);
        }

        heartTimer = setInterval(() => {
          if (heartNumber % 2 === 0) {
            heartNumber++;
            socket.send('H1');
          }

          reconnect();
        }, 25 * 1000);
      };

      socket.onerror = () => {
        if (socket.readyState === 3) {
          setInterval(() => reconnect(), 10 * 1000);
        }
      };

      socket.onmessage = (message: MessageEvent) => {
        const event = Object.freeze({
          rf: () => {
            signUpStatus = false;
            reconnect();
          },
          os: reconnect,
          cr: reconnect,
          ro: () => {
            signUpStatus = true;

            request(signUpPath as string, {
              protocol,
              type: 'REGISTER',
              method: 'POST',
              host,
              seq,
            });
          },
          ho: () => heartNumber++,
          hf: reconnect,
          nf: (result?: string) => {
            socketMethod.emit('message', result);

            socket.send('NO');
          },
        });

        const data = message.data as string;
        const signal = data?.slice(0, 2) as CommandWordString;

        event[CommandWord[signal]](signal === 'NF' ? data : undefined);
      };
    };

    const reconnect = () => {
      const online = signUpStatus && socket.CONNECTING;

      if (online) {
        const result = request(signOutPath as string, {
          protocol,
          type: 'UNREGISTER',
          method: 'POST',
          host,
          seq,
        });

        socket.send(result);
      } else {
        close();
      }

      connect();
    };

    const close = () => {
      clearInterval(heartTimer);

      socket.close();
      signUpStatus = false;
      heartNumber = 0;
    };

    const events = {} as Record<string, Function[]>;
    const socketMethod = Object.freeze({
      connect,
      reconnect,
      close,
      on: (event: string, callback: Function) => {
        events[event] = events[event] ?? [];
        events[event].push(callback);
      },
      emit: (event: string, ...args: unknown[]) => {
        if (events[event]) {
          for (const item of events[event]) {
            item.apply(item, args);
          }
        }
      },
    });

    return socketMethod;
  };
};

const initSocketRequest: InitSocketRequest =
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
