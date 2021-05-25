import {Server} from 'mock-socket';
import {initSocket} from '../src/socket';

describe('test/token.test.ts', () => {
  let mockServer!: Server;

  before(() => {
    const fakeURL = 'wss://localhost:8080';

    mockServer = new Server(fakeURL);
    mockServer.on('connection', socket => {
      socket.on('message', data => {
        if ((data as string).startsWith('RG')) {
          socket.send('RO#1534692949977#25000');
        }

        if ((data as string).startsWith('H1')) {
          socket.send('HO# The heartbeat is maintained successfully.');
        }

        if ((data as string).startsWith('signOut')) {
          socket.send('HF# Heartbeat hold failure.');
        }
      });
    });
  });

  //   it('should be a gateway sign up', done => {
  //     const socket = initSocket({
  //       appKey: '1234455',
  //       appSecret: 'MTIzNDQ1NQ==',
  //       socketOptions: {
  //         host: 'localhost',
  //         signOutPath: '',
  //         signUpPath: '',
  //       },
  //     })();

  //     socket.connect();
  //     socket.on('signUp', (m: Record<string, unknown>) => {
  //       assert(m.success);
  //     });

  //     setTimeout(() => {
  //       done();
  //     }, 100);
  //   });

  it('should be a gateway sign out', done => {
    const socket = initSocket({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
      socketOptions: {
        host: 'localhost',
        signOutPath: '',
        signUpPath: '',
      },
    })();

    socket.connect();

    // socket.on('open', () => {
    //   socket.signUp();
    // });

    // socket.on('signUp', () => {
    //   console.info(signUp);
    // });

    // socket.send('signOut');

    setTimeout(() => {
      done();
    }, 1000);
  });

  after(() => {
    mockServer.stop();
  });
});
