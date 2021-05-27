import * as assert from 'assert';
import {headers as HEADERS} from '../src/headers';
// import {Server, WebSocket} from 'mock-socket';
import {SocketResult} from '../src/interface/socket.interface';
import {initSocket} from '../src/socket';

global.WebSocket = require('websocket').w3cwebsocket;

// let MOCK_SERVER!: Server;
let SOCKET!: SocketResult;

describe('test/socketcc.test.ts', () => {
  before(() => {
    // MOCK_SERVER = new Server('ws://localhost:8080');
    // MOCK_SERVER.on('connection', io => {
    //   io.on('message', data => {
    //     if ((data as string).startsWith('RG')) {
    //       io.send('RO#1534692949977#1000');
    //     }

    //     if ((data as string).startsWith('H1')) {
    //       io.send('HO#The heartbeat is maintained successfully.');
    //     }

    //     if ((data as string).startsWith('OS')) {
    //       io.send(
    //         'OS#The volume of client requests reaches the traffic control threshold of the API gateway.'
    //       );
    //     }

    //     if ((data as string).startsWith('NF')) {
    //       io.send('NF#OK.');
    //     }

    //     // const obj = JSON.parse(data as string);

    //     type Json = Record<
    //       string,
    //       Record<string, {headers: string[]; [key: string]: unknown}>
    //     >;

    //     let json!: string | Json;

    //     try {
    //       json = JSON.parse(data as string);
    //     } catch (error) {
    //       json = data as string;
    //     }

    //     const jsonData = typeof json === 'object' && json !== null;
    //     const signUp =
    //       jsonData &&
    //       (json as Json)?.headers['x-ca-websocket_api_type'][0] === 'REGISTER';

    //     const signOut =
    //       jsonData &&
    //       (json as Json)?.headers['x-ca-websocket_api_type'][0] ===
    //         'UNREGISTER';

    //     if (signUp) {
    //       return io.send(JSON.stringify({status: 200, body: 'SIGN_UP'}));
    //     }

    //     if (signOut) {
    //       return io.send(JSON.stringify({status: 200, body: 'SIGN_OUT'}));
    //     }
    //   });
    // });

    const headers = {
      'x-client': 'thalloSgG2svEN6t1BFU',
      'x-domain-id': '0',
      'x-language': 'zh-CN',
      'x-project-id': '49793310063067136',
      'x-region': 'CN',
      'x-token':
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlRhUm90LTIwMjAtMTU4NTU1MDE0MjAwMCJ9.eyJhdXRob3JpemF0aW9uIjoiMTQzNjE5NzQ4MDEzNjcwNCIsImlzcyI6Imh0dHBzOi8vYXBpLnRoYWxsb25ldC5jb20iLCJpYXQiOjE2MjIwODc2NzgsImV4cCI6MTYyNDY3OTY3OH0.extrXnfry8dh9oa10frGXSS-hRN1IMo_QJvMArMh5d6ynTVQTpl7EHyU1p9T2fU7ZTA4AF7bO25UH9kOJXcbn9AZ9t2tsO_-L5Q-mcce8hcbkXZhgWyjwDw_QJ9FDBQHEWwP9eQRDuGkyVPv-vOmvRA1bXGgUKMYx0iiRr1oTjCutP3t1HpK9IpypOszENcwn2vzm4rwSFjistVjOFK0Zxav6WdDhBq6nHu4aCZ5uurGFQ7m7ASSmkea5HH07u-ihpJyW0pT8njlKHw-G_1pnB7Uiwc91AiVau2RxYiXNhaEfIErcjTiVgDYR_QYYsZpTvnra0V100zMV4iC6Qv7nQ',
    } as any;

    for (const key of Object.keys(headers)) {
      HEADERS.set(key, headers[key]);
    }

    SOCKET = initSocket({
      appKey: '333399604',
      appSecret: '01860911446f4cc9bb6a803b6c04a267',
      stage: 'RELEASE',
      headers: {
        'x-token':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlRhUm90LTIwMjAtMTU4NTU1MDE0MjAwMCJ9.eyJhdXRob3JpemF0aW9uIjoiMTQzNjE5NzQ4MDEzNjcwNCIsImlzcyI6Imh0dHBzOi8vYXBpLnRoYWxsb25ldC5jb20iLCJpYXQiOjE2MjIwODc2NzgsImV4cCI6MTYyNDY3OTY3OH0.extrXnfry8dh9oa10frGXSS-hRN1IMo_QJvMArMh5d6ynTVQTpl7EHyU1p9T2fU7ZTA4AF7bO25UH9kOJXcbn9AZ9t2tsO_-L5Q-mcce8hcbkXZhgWyjwDw_QJ9FDBQHEWwP9eQRDuGkyVPv-vOmvRA1bXGgUKMYx0iiRr1oTjCutP3t1HpK9IpypOszENcwn2vzm4rwSFjistVjOFK0Zxav6WdDhBq6nHu4aCZ5uurGFQ7m7ASSmkea5HH07u-ihpJyW0pT8njlKHw-G_1pnB7Uiwc91AiVau2RxYiXNhaEfIErcjTiVgDYR_QYYsZpTvnra0V100zMV4iC6Qv7nQ',
      },
      socketOptions: {
        host: 'dev.api.thallonet.com',
        signOutPath: '/v4/mobile/guardians/sockets/signOutSockets',
        signUpPath: '/v4/mobile/guardians/sockets/signUpSockets',
      },
    })();
  });

  it('should be socket connection ready', done => {
    SOCKET.connect();
    SOCKET.on('open', (data: Record<string, unknown>) => {
      console.info('open');
      assert(data.success);
      assert(
        data.message ===
          'The connection has been established and is ready for communication.'
      );
    });

    SOCKET.on('signUp', (data: Record<string, unknown>) => {
      console.info('signUp');
      assert(data.success);
      assert(data.message === 'Gateway sign up is successful.');
    });

    SOCKET.on('heartbeat', (data: Record<string, unknown>) => {
      console.info('heartbeat');
      assert(data.success);
      assert(data.message === 'Maintaining a successful heartbeat.');
    });

    SOCKET.on('close', (data: Record<string, unknown>) => {
      console.info('close');
      assert(data.success);
      assert(data.message === 'Connection is closed.');
    });

    SOCKET.on('signOut', (data: Record<string, unknown>) => {
      console.info('signOut');
      assert(data.success);
      assert(data.message === 'Gateway sign out is successful.');
    });

    SOCKET.on('message', (message: string) => {
      console.info('message', message);
      assert(typeof message === 'string');
    });

    SOCKET.on('reconnect', (message: string) => {
      console.info('reconnect');
      assert(typeof message === 'string');
    });

    setTimeout(() => {
      //   SOCKET.close();
      done();
    }, 15000);
  }).timeout(16000);

  //   it('should be socket heartbeat', done => {
  //     SOCKET.on('heartbeat', (data: Record<string, unknown>) => {
  //       console.info('heartbeat');
  //       assert(data.success);
  //       assert(data.message === 'Maintaining a successful heartbeat.');
  //     });

  //     setTimeout(() => {
  //       done();
  //     }, 2000);
  //   }).timeout(3000);

  //   it('should be socket message', done => {
  //     SOCKET.on('message', (message: string) => {
  //       assert(typeof message === 'string');
  //     });

  //     SOCKET.send('NF');

  //     setTimeout(() => {
  //       done();
  //     }, 100);
  //   });

  //   it('should be socket reconnect', done => {
  //     SOCKET.on('open', (data: Record<string, unknown>) => {
  //       assert(data.success);
  //     });

  //     SOCKET.send('OS');

  //     setTimeout(() => {
  //       done();
  //     }, 100);
  //   });

  //   it('should be socket closed', done => {
  //     SOCKET.on('close', (data: Record<string, unknown>) => {
  //       console.info('close');
  //       assert(data.success);
  //       assert(data.message === 'Connection is closed.');

  //       SOCKET.send('233');
  //     });

  //     SOCKET.on('signOut', (data: Record<string, unknown>) => {
  //       console.info('signOut');
  //       assert(data.success);
  //       assert(data.message === 'Gateway sign out is successful.');
  //     });

  //     // SOCKET.close();

  //     setTimeout(() => {
  //       done();
  //     }, 100);
  //   });

  //   it('should be socket error', done => {
  //     SOCKET.on('error', (data: Record<string, unknown>) => {
  //       console.info('error');
  //       assert(data.type === 'error');
  //     });

  //     MOCK_SERVER.simulate('error');

  //     setTimeout(() => {
  //       done();
  //     }, 1000);
  //   });

  after(() => {
    // MOCK_SERVER.stop();
  });
});
