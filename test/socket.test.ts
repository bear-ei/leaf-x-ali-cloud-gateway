// import * as assert from 'assert';
// import {Server, WebSocket} from 'mock-socket';
// import {SocketResult} from '../src/interface/socket.interface';
// import {initSocket} from '../src/socket';

// global.WebSocket = WebSocket;

// let MOCK_SERVER!: Server;
// let SOCKET!: SocketResult;

// describe('test/socket.test.ts', () => {
//   before(() => {
//     MOCK_SERVER = new Server('ws://localhost:8080');
//     MOCK_SERVER.on('connection', io => {
//       io.on('message', data => {
//         if ((data as string).startsWith('RG')) {
//           io.send('RO#1534692949977#1000');
//         }

//         if ((data as string).startsWith('H1')) {
//           io.send('HO#The heartbeat is maintained successfully.');
//         }

//         if ((data as string).startsWith('OS')) {
//           io.send(
//             'OS#The volume of client requests reaches the traffic control threshold of the API gateway.'
//           );
//         }

//         if ((data as string).startsWith('NF')) {
//           io.send('NF#OK.');
//         }

//         // const obj = JSON.parse(data as string);

//         type Json = Record<
//           string,
//           Record<string, {headers: string[]; [key: string]: unknown}>
//         >;

//         let json!: string | Json;

//         try {
//           json = JSON.parse(data as string);
//         } catch (error) {
//           json = data as string;
//         }

//         const jsonData = typeof json === 'object' && json !== null;
//         const signUp =
//           jsonData &&
//           (json as Json)?.headers['x-ca-websocket_api_type'][0] === 'REGISTER';

//         const signOut =
//           jsonData &&
//           (json as Json)?.headers['x-ca-websocket_api_type'][0] ===
//             'UNREGISTER';

//         if (signUp) {
//           return io.send(JSON.stringify({status: 200, body: 'SIGN_UP'}));
//         }

//         if (signOut) {
//           return io.send(JSON.stringify({status: 200, body: 'SIGN_OUT'}));
//         }
//       });
//     });

//     SOCKET = initSocket({
//       appKey: '1234455',
//       appSecret: 'MTIzNDQ1NQ==',
//       socketOptions: {
//         host: 'localhost',
//         signOutPath: '',
//         signUpPath: '',
//       },
//     })();
//   });

//   it('should be socket connection ready', done => {
//     SOCKET.connect();
//     SOCKET.on('open', (data: Record<string, unknown>) => {
//       console.info('open');
//       assert(data.success);
//       assert(
//         data.message ===
//           'The connection has been established and is ready for communication.'
//       );
//     });

//     SOCKET.on('signUp', (data: Record<string, unknown>) => {
//       console.info('signUp');
//       assert(data.success);
//       assert(data.message === 'Gateway sign up is successful.');
//     });

//     setTimeout(() => {
//       done();
//     }, 100);
//   });

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

//     SOCKET.close();

//     setTimeout(() => {
//       done();
//     }, 100);
//   });

//   //   it('should be socket error', done => {
//   //     SOCKET.on('error', (data: Record<string, unknown>) => {
//   //       console.info('error');
//   //       assert(data.type === 'error');
//   //     });

//   //     MOCK_SERVER.simulate('error');

//   //     setTimeout(() => {
//   //       done();
//   //     }, 1000);
//   //   });

//   after(() => {
//     MOCK_SERVER.stop();
//   });
// });
