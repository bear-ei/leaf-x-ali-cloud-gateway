import {CommandWord as CommandWordEnum} from '../enum/socket.enum';
import {initSignOut} from './sign_out';
import {initSignUp} from './sign_up';

const socket = options => {
  let heartTimer!: NodeJS.Timeout;
  let socket!: WebSocket;
  let heartNumber = 0;
  let signUpStatus = false;
  let device!: string;

  const connect = (deviceId: string, {ssl, host, port}) => {
    device = deviceId;

    const signUp = initSignUp(options);

    socket = new WebSocket(`${ssl ? 'wss' : 'ws'}://${host}:${port}`);
    socket.onopen = () => {
      if (socket.readyState === 1) {
        socket.send(`RG#${deviceId}`);
      }

      heartTimer = setInterval(() => {
        if (heartNumber % 2 === 0) {
          heartNumber++;
          socket.send('H1');
        } else {
          reconnect();
        }
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
          signUp();
        },
        ho: () => HEART_NUMBER++,
        hf: reconnect,
        nf: () => {
          //   if (!this.onNotify) {
          //     throw new Error('No notification');
          //   }
          //   this.onNotify(m.data.substring(3));
          //   this._connection.send('NO');

          SOCKET.send('NO');
        },
      });

      const data = message.data;

      if (data?.startsWith('RF')) {
        event[CommandWordEnum['RF']]();
      } else if (data?.startsWith('OS')) {
        event[CommandWordEnum['OS']]();
      } else if (data?.startsWith('CR')) {
        event[CommandWordEnum['CR']]();
      } else if (data?.startsWith('RO')) {
        event[CommandWordEnum['RO']]();
      } else if (data?.startsWith('NF')) {
        event[CommandWordEnum['NF']]();
      } else if (data?.startsWith('HO')) {
        event[CommandWordEnum['HO']]();
      } else if (data?.startsWith('HF')) {
        event[CommandWordEnum['HF']]();
      }
    };
  };

  const reconnect = () => {
    signUpStatus && socket.CONNECTING ? initSignOut(options) : close();

    connect(options);
  };

  const close = () => {
    clearInterval(heartTimer);

    socket.close();
    signUpStatus = false;
    heartNumber = 0;
  };

  return {
    connect,
    reconnect,
    close,
  };
};

// export const socketClose = () => {
//   clearInterval(HEART_TIMER);

//   SOCKET.close();
//   SIGN_UP_STATUS = false;
//   HEART_NUMBER = 0;
// };

// export {SOCKET};
