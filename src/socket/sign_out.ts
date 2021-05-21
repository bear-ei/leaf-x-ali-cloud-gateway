import {handleUrl} from '@leaf-x/fetch';
import {initGetRequestHeaders} from '../headers';
import {InitSocketSignOut} from '../interface/socket/sign_out.interface';

export const initSignOut: InitSocketSignOut =
  options =>
  (path, {seq, method, data, host, params = {}}) => {
    if (!host) {
      throw new Error('Missing socket host.');
    }

    const url = `ws://${host}${path}`;
    const requestUrl = handleUrl({url, params});
    const headers = initGetRequestHeaders(options)({
      url: requestUrl,
      data,
      host,
      headers: {
        'x-ca-seq': `${seq}`,
        'x-ca-websocket_api_type': 'UNREGISTER',
      },
    });

    return JSON.stringify({method, data, host, path, headers});
  };
