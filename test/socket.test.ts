import * as assert from 'assert';
import {Client, Server} from 'mock-socket';
import {Event, initSocket, SendSocketOptions} from '../src/socket';

type Json = Record<
  string,
  Record<string, {headers: string[]; [key: string]: unknown}>
>;

let MOCK_SERVER!: Server;
let SOCKET!: {
  connect: () => void;
  close: () => void;
  on: (event: Event, fun: Function) => void;
  send: (event: string, options?: SendSocketOptions) => void;
};

let heartNumber = 0;

const send = (io: Client, data: string) => {
  if (data.startsWith('H1')) {
    if (heartNumber === 0) {
      io.send('HO#The heartbeat is maintained successfully.');
      heartNumber++;
    }
  }

  data.startsWith('RG') && io.send('RO#1534692949977#1000');
  data.startsWith('OS') &&
    io.send(
      'OS#The volume of client requests reaches the traffic control threshold of the API gateway.'
    );

  data.startsWith('NF') && io.send('NF#OK.');
  data.startsWith('TEST-STRING') && io.send('');
  data.startsWith('TEST-404') &&
    io.send(
      JSON.stringify({
        status: 404,
        body: 'SIGN_UP',
        header: {'x-ca-seq': '1'},
      })
    );
};

describe('test/socket.test.ts', () => {
  before(() => {
    MOCK_SERVER = new Server('ws://localhost:8080');
    MOCK_SERVER.on('connection', io => {
      io.on('message', data => {
        let json!: string | Json;
        const relData = data as string;

        send(io, relData);

        try {
          json = JSON.parse(relData);
        } catch (error) {
          json = relData;
        }

        const jsonData = typeof json === 'object' && json !== null;
        const isSignUp =
          jsonData &&
          (json as Json)?.headers['x-ca-websocket_api_type'][0] === 'REGISTER';

        const isSignOut =
          jsonData &&
          (json as Json)?.headers['x-ca-websocket_api_type'][0] ===
            'UNREGISTER';

        if (isSignUp) {
          return io.send(
            JSON.stringify({
              status: 200,
              body: 'SIGN_UP',
              header: {'x-ca-seq': '1'},
            })
          );
        }

        if (isSignOut) {
          return io.send(
            JSON.stringify({
              status: 200,
              body: 'SIGN_OUT',
              header: {'x-ca-seq': '1'},
            })
          );
        }
      });
    });

    const socket = initSocket({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
      socketOptions: {
        signOutPath: '/v4/mobile/guardians/sockets/signOutSockets',
        signUpPath: '/v4/mobile/guardians/sockets/signUpSockets',
      },
    });

    SOCKET = socket;
    SOCKET.connect();
  });

  it('should be socket connection ready', done => {
    SOCKET.on('SEND', (message: string) => {
      assert(message);
    });

    SOCKET.on('OPEN', (message: string) => {
      assert(
        message ===
          'The connection has been established and is ready for communication.'
      );
    });

    SOCKET.on('SIGN_UP', (message: string) => {
      assert(
        message === 'The gateway with sequence 1 is signed up successfully.'
      );
    });

    setTimeout(() => {
      done();
    }, 100);
  });

  it('should be socket heartbeat', done => {
    SOCKET.on('HEARTBEAT', (message: string) => {
      assert(message === 'Maintaining a successful heartbeat.');
    });

    setTimeout(() => {
      done();
    }, 4000);
  }).timeout(5000);

  it('should be socket message', done => {
    SOCKET.on('MESSAGE', (message: string) => {
      assert(typeof message === 'string');
    });

    SOCKET.send('NF');
    SOCKET.send('TEST-STRING');
    SOCKET.send('TEST-404');

    try {
      SOCKET.send('MESSAGE');
    } catch (error) {
      assert(
        (error as Record<string, unknown>).message ===
          'Missing send event path.'
      );
    }

    setTimeout(() => {
      done();
    }, 100);
  });

  it('should be socket reconnect', done => {
    SOCKET.on('RECONNECT', (message: string) => {
      assert(message === 'Try to re-establish the connection.');
    });

    SOCKET.send('OS');

    setTimeout(() => {
      done();
    }, 100);
  });

  it('should be socket error', done => {
    SOCKET.on('ERROR', (data: Record<string, unknown>) => {
      assert(data.type === 'error');
    });

    MOCK_SERVER.simulate('error');

    setTimeout(() => {
      done();
    }, 100);
  });

  it('should be socket close', done => {
    SOCKET.on('SIGN_OUT', (message: string) => {
      assert(
        message === 'The gateway with sequence 1 is signed out successfully.'
      );
    });

    SOCKET.on('CLOSE', (message: string) => {
      assert(message === 'Close the connection successfully.');
    });

    SOCKET.on('OPEN', (message: string) => {
      assert(message);
    });

    SOCKET.close();

    setTimeout(() => {
      done();
    }, 100);
  });

  after(() => {
    MOCK_SERVER.stop();
  });
});
