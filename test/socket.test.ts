import {Server} from 'mock-socket';
import {initSocket} from '../src/socket';

describe('test/token.test.ts', () => {
  it('should get the request token', async () => {
    const mockServer = new Server('wss://localhost:8080/');

    mockServer.on('connection', s => {
      s.on('message', data => {
        if ((data as string).startsWith('RG')) {
          s.send('NF# test message from mock server');
        }
      });
    });

    const socket = initSocket({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
      socketOptions: {
        host: 'localhost',
        signOutPath: '',
        signUpPath: '',
      },
    });

    const socketC = socket();

    socketC.connect();

    socketC.on('message', (result: any) => {
      console.info(result);
    });

    setTimeout(() => {
      //   mockServer.stop();
    }, 100);
  });
});
