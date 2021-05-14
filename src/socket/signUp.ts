import {initGetRequestHeaders} from '../headers';
import {SOCKET} from './connect';

const initSignUp =
  () =>
  ({method, data, params}) => {
    const headers = initGetRequestHeaders(gatewayOptions)({
      data,
      headers: {'x-ca-seq': '-1'},
    });

    SOCKET.send(JSON.stringify({method, data, params}));
  };
