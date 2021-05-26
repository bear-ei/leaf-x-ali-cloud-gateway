import {SocketResult} from '../src/interface/socket.interface';
import {initSocket} from '../src/socket';

let SOCKET!: SocketResult;

describe('test/socketC.test.ts', () => {
  before(() => {
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
  });
});
