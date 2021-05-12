import {InitGateway} from './interface/gateway.interface';
import {initRequest} from './request';

export const gateway: InitGateway = ({
  appKey,
  appSecret,
  stage = 'RELEASE',
  ...args
}) => {
  const options = {appKey, appSecret, stage, ...args};

  return {
    request: initRequest(options),
  };
};
