import {headers} from './headers';
import {InitGateway} from './interface/gateway.interface';
import {initRequest} from './request';
import {initSocket} from './socket';

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
