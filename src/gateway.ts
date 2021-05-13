import {InitGateway} from './interface/gateway.interface';
import {initRequest} from './request';

export const gateway: InitGateway = ({
  appKey,
  appSecret,
  stage = 'RELEASE',
  timeout = 3000,
  ...args
}) => {
  const options = {appKey, appSecret, stage, timeout, ...args};

  return {
    request: initRequest(options),
  };
};
