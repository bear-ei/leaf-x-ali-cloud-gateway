import {handleUrl} from '@leaf-x/fetch';
import {initGetRequestHeaders} from '../headers';
import {InitSocketSignOut} from '../interface/socket/sign_out.interface';
import {SOCKET, socketClose} from './connect';

export const initSignOut: InitSocketSignOut =
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
        'x-ca-websocket_api_type': JSON.stringify(['UNREGISTER']),
      },
    });

    SOCKET.send(JSON.stringify({method, data, host, path, headers}));

    socketClose();
  };
