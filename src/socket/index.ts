import * as uuid from 'uuid';
import {CommandWord, CommandWordString} from '../enum/socket.enum';
import {InitSocket} from '../interface/socket/socket.interface';
import {initSignOut} from './sign_out';
import {initSignUp} from './sign_up';

export const initSocket: InitSocket = ({socketOptions, ...args}) => {
  const {
    host,
    secure = false,
    port = 8080,
    signUpPath,
    signOutPath,
    deviceId = `${uuid.v4().replace(new RegExp('-', 'g'), '')}@${args.appKey}`,
  } = socketOptions ?? {};

  const signUp = initSignUp(args);
  const signOut = initSignOut(args);

  let seq = -1;
  let heartTimer!: NodeJS.Timeout;
  let socket!: WebSocket;
  let heartNumber = 0;
  let signUpStatus = false;

  return () => {
    const connect = () => {
      seq++;

      socket = new WebSocket(`${secure ? 'wss' : 'ws'}://${host}:${port}`);
    };

    const reconnect = () => {
      const online = signUpStatus && socket.CONNECTING;

      if (online) {
        const result = signOut(`https://${host}/${signOutPath}`, {
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

      throw new Error('socket connection error.');
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

          signUp(`https://${host}/${signUpPath}`, {
            method: 'POST',
            host,
            seq,
          });
        },
        ho: () => heartNumber++,
        hf: reconnect,
        nf: (result?: string) => {
          socketMethod.onNotify(result?.slice(3));

          socket.send('NO');
        },
      });

      const data = message.data as string;
      const signal = data?.slice(0, 2) as CommandWordString;

      event[CommandWord[signal]](signal === 'NF' ? data : undefined);
    };

    const socketMethod = Object.freeze({
      connect,
      reconnect,
      close,
      onNotify: (message?: string) => message,
    });

    return socketMethod;
  };
};
