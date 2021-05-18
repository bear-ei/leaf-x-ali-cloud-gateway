import {InitSocket} from '../interface/socket/socket.interface';

const initSocket: InitSocket =
  ({appKey, deviceId, socket}) =>
  () => {
    // const deviceId;

    const {host, ssl = false, port = 8080} = socket ?? {};
  };
