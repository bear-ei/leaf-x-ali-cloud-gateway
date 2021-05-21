import {handleUrl} from '@leaf-x/fetch';
import {initGetRequestHeaders} from '../headers';
import {InitSocketSignUp} from '../interface/socket/sign_up.interface';

export const initSignUp: InitSocketSignUp =
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
        'x-ca-websocket_api_type': 'REGISTER',
      },
    });

    return {method, data, host, path, headers};
  };
