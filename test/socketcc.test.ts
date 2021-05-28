import {headers as HEADERS} from '../src/headers';
import {initSocket} from '../src/socket';

global.WebSocket = require('websocket').w3cwebsocket;

// let MOCK_SERVER!: Server;
// let SOCKET!: SocketResult;

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

const SOCKET = initSocket({
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

SOCKET.connect();
SOCKET.on('open', (data: Record<string, unknown>) => {
  console.info('open-on');
});

SOCKET.on('signUp', (data: Record<string, unknown>) => {
  console.info('signUp-on', data);
});

SOCKET.on('heartbeat', (data: Record<string, unknown>) => {
  console.info('heartbeat-on');
});

SOCKET.on('close', (data: Record<string, unknown>) => {
  console.info('close-on');
});

SOCKET.on('signOut', (data: Record<string, unknown>) => {
  console.info('signOut-on', data);
});

SOCKET.on('message', (message: string) => {
  console.info('message', message);
});

SOCKET.on('reconnect', (message: string) => {
  console.info('reconnect-on');
});

SOCKET.on('error', (data: Record<string, unknown>) => {
  console.info('error-on');
});
