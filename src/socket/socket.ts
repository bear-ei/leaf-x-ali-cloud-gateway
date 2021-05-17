import {InitSocket} from '../interface/socket/socket.interface';

const initSocket: InitSocket =
  ({appKey, socket}) =>
  () => {
    const {host, ssl = false, port = 8080} = socket ?? {};
  };
