import {handleUrl} from '@leaf-x/fetch';
import {initGetRequestHeaders} from '../headers';
import {InitSocketSignUp} from '../interface/socket/sign_up.interface';
import {SOCKET} from './connect';

export const initSignUp: InitSocketSignUp =
  options =>
  (path, {method, data, host, params = {}}) => {
    const url = `ws://${host}${path}`;
    const requestUrl = handleUrl({url, params});
    const headers = initGetRequestHeaders(options)({
      url: requestUrl,
      data,
      host,
      headers: {
        'x-ca-seq': '-1',
        'x-ca-websocket_api_type': JSON.stringify(['REGISTER']),
      },
    });

    SOCKET.send(JSON.stringify({method, data, host, path, headers}));
  };
