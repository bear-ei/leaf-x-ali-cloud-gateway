import {CommandWord as CommandWordEnum} from '../enum/s';

let HEART_TIMER!: NodeJS.Timeout;
let SOCKET!: WebSocket;
let HEART_NUMBER = 0;

const socketConnect =
  ({ssl, host, port}) =>
  (deviceId: string) => {
    SOCKET = new WebSocket(`${ssl ? 'wss' : 'ws'}://${host}:${port}`);
    SOCKET.onopen = () => {
      if (SOCKET.readyState === 1) {
        SOCKET.send(`RG#${deviceId}`);
      }

      HEART_TIMER = setInterval(() => {
        if (HEART_NUMBER % 2 === 0) {
          HEART_NUMBER++;
          SOCKET.send('H1');
        } else {
          socketReconnect();
        }
      }, 25 * 1000);
    };

    SOCKET.onerror = () => {
      if (SOCKET.readyState === 3) {
        setInterval(() => socketReconnect(), 10 * 1000);
      }
    };

    SOCKET.onmessage = (message: MessageEvent) => {
      const event = Object.freeze({
        rf: socketReconnect,
        os: socketReconnect,
        cr: socketReconnect,
        ro: register,
        ho: () => HEART_NUMBER++,
        hf: socketReconnect,
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

const socketClose = () => {
  clearInterval(HEART_TIMER);

  SOCKET.close();
  //   this._isRegister = false;
  HEART_NUMBER = 0;
};

const socketReconnect = () => {
  // this._isRegister &&
  if (SOCKET.CONNECTING) {
    // this.logout();
  } else {
    socketClose();
  }

  SOCKET.CONNECTING ? '' : socketClose();

  socketConnect();
};

export {SOCKET};
