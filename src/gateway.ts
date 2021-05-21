import {headers} from './headers';
import {InitGateway} from './interface/gateway.interface';
import {initRequest} from './request';
import {initSocket} from './socket';

const reactNative =
  typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

if (reactNative) {
  require('./shim');
  require('react-native-url-polyfill/auto');
}

export const gateway: InitGateway = ({
  appKey,
  appSecret,
  stage = 'RELEASE',
  timeout = 3000,
  ...args
}) => {
  const options = {appKey, appSecret, stage, timeout, ...args};

  return Object.freeze({
    request: initRequest(options),
    socket: initSocket(options),
    headers,
  });
};
