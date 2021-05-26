import * as assert from 'assert';
import {Server, WebSocket} from 'mock-socket';
import {SocketResult} from '../src/interface/socket.interface';
import {initSocket} from '../src/socket';

global.WebSocket = WebSocket;

let MOCK_SERVER!: Server;
let SOCKET!: SocketResult;

describe('test/socket.test.ts', () => {
  before(() => {
    MOCK_SERVER = new Server('ws://localhost:8080');
    MOCK_SERVER.on('connection', s => {
      s.on('message', data => {
        if ((data as string).startsWith('RG')) {
          s.send('RO#1534692949977#1000');
        }

        if ((data as string).startsWith('H1')) {
          s.send('HO#The heartbeat is maintained successfully.');
        }

        if ((data as string).startsWith('OS')) {
          s.send(
            'OS#The volume of client requests reaches the traffic control threshold of the API gateway.'
          );
        }

        if ((data as string).startsWith('NF')) {
          s.send('NF#OK.');
        }
      });
    });

    SOCKET = initSocket({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
      socketOptions: {
        host: 'localhost',
        signOutPath: '',
        signUpPath: '',
      },
    })();
  });

  it('should be socket connection ready', done => {
    SOCKET.connect();
    SOCKET.on('open', (data: Record<string, unknown>) => {
      assert(data.success);
      assert(
        data.message ===
          'The connection has been established and is ready for communication.'
      );
    });

    SOCKET.on('signUp', (data: Record<string, unknown>) => {
      assert(data.success);
      assert(data.message === 'Gateway sign up is successful.');
    });

    setTimeout(() => {
      done();
    }, 100);
  });

  it('should be socket heartbeat', done => {
    SOCKET.on('heartbeat', (data: Record<string, unknown>) => {
      assert(data.success);
      assert(data.message === 'Maintaining a successful heartbeat.');
    });

    setTimeout(() => {
      done();
    }, 2000);
  }).timeout(3000);

  it('should be socket error', done => {
    SOCKET.on('error', (data: Record<string, unknown>) => {
      assert(data.type === 'error');
    });

    MOCK_SERVER.simulate('error');

    setTimeout(() => {
      done();
    }, 100);
  });

  it('should be socket reconnect', done => {
    SOCKET.on('open', (data: Record<string, unknown>) => {
      assert(data.success);
    });

    SOCKET.send('OS');

    setTimeout(() => {
      done();
    }, 100);
  });

  it('should be socket message', done => {
    SOCKET.on('message', (message: string) => {
      assert(message === 'OK.');
    });

    SOCKET.send('NF');

    setTimeout(() => {
      done();
    }, 100);
  });

  it('should be socket closed', done => {
    SOCKET.on('close', (data: Record<string, unknown>) => {
      assert(data.success);
      assert(data.message === 'Connection is closed.');
    });

    SOCKET.on('signOut', (data: Record<string, unknown>) => {
      assert(data.success);
      assert(data.message === 'Gateway sign out is successful.');
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
