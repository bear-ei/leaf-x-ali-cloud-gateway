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
//           return io.send(
//             JSON.stringify({
//               status: 200,
//               body: 'SIGN_UP',
//               header: {'x-ca-seq': '1'},
//             })
//           );
//         }

//         if (signOut) {
//           return io.send(
//             JSON.stringify({
//               status: 200,
//               body: 'SIGN_OUT',
//               header: {'x-ca-seq': '1'},
//             })
//           );
//         }
//       });
//     });

//     SOCKET = initSocket({
//       appKey: '1234455',
//       appSecret: 'MTIzNDQ1NQ==',
//       socketOptions: {
//         host: 'localhost',
//         signOutPath: '/v4/mobile/guardians/sockets/signOutSockets',
//         signUpPath: '/v4/mobile/guardians/sockets/signUpSockets',
//       },
//     })();

//     SOCKET.connect();
//   });

//   it('should be socket connection ready', done => {
//     SOCKET.on('open', (success: string) => {
//       console.info('open-test');

//       assert(
//         success ===
//           'The connection has been established and is ready for communication.'
//       );
//     });

//     SOCKET.on('signUp', (message: string) => {
//       console.info('signUp-test');

//       assert(
//         message === 'The gateway with sequence 1 is signed up successfully.'
//       );
//     });

//     setTimeout(() => {
//       done();
//     }, 100);
//   });

//   it('should be socket heartbeat', done => {
//     SOCKET.on('heartbeat', (message: string) => {
//       console.info('heartbeat-test');

//       assert(message === 'Maintaining a successful heartbeat.');
//     });

//     setTimeout(() => {
//       done();
//     }, 3000);
//   }).timeout(4000);

//   it('should be socket message', done => {
//     SOCKET.on('message', (message: string) => {
//       console.info('message-test');

//       assert(typeof message === 'string');
//     });

//     SOCKET.send('NF');

//     setTimeout(() => {
//       done();
//     }, 100);
//   });

//   it('should be socket reconnect', done => {
//     SOCKET.on('reconnect', (message: string) => {
//       console.info('reconnect-test');
//       assert(message === 'Try to re-establish the connection.');
//     });

//     SOCKET.on('close', (message: string) => {
//       console.info('close-test');
//       assert(message === 'Connection is closed.');
//     });

//     SOCKET.on('signOut', (message: string) => {
//       console.info('signOut-test');

//       assert(
//         message === 'The gateway with sequence 1 is signed out successfully.'
//       );
//     });

//     SOCKET.send('OS');

//     setTimeout(() => {
//       done();
//     }, 100);
//   });

//   it('should be socket error', done => {
//     SOCKET.on('error', (data: Record<string, unknown>) => {
//       console.info('error-test');

//       assert(data.type === 'error');
//     });

//     MOCK_SERVER.simulate('error');

//     setTimeout(() => {
//       SOCKET.close();
//       done();
//     }, 100);
//   });

//   after(() => {
//     MOCK_SERVER.stop();
//   });
// });
