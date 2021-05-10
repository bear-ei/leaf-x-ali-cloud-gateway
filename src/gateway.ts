import {InitGateway} from './interface/gateway.interface';
import {initRequest} from './request';

export const gateway: InitGateway = ({
  appKey,
  appSecret,
  stage = 'RELEASE',
}) => {
  const options = {appKey, appSecret, stage};

  return {
    request: initRequest(options),
  };
};
