import * as crypto from 'crypto';
import {getCanonicalHeaders} from './headers';
import {GetSignString, GetToken, InitSign} from './interface/token.interface';

const initSign: InitSign = secret => signString =>
  crypto
    .createHmac('sha256', secret)
    .update(signString, 'utf8')
    .digest('base64');

const getSignString: GetSignString = ({method, url, headers}) => {
  const {search, pathname} = new URL(url);
  const {canonicalHeadersKeysString, canonicalHeadersString} =
    getCanonicalHeaders({prefix: 'x-ca-'}, headers);

  console.info(decodeURIComponent(search ? `${pathname}${search}` : pathname));

  return {
    canonicalHeadersKeysString,
    signString: [
      method,
      headers['accept'],
      headers['content-md5'],
      headers['content-type'],
      headers['date'],
      canonicalHeadersString,
      decodeURIComponent(search ? `${pathname}${search}` : pathname),
    ].join('\n'),
  };
};

export const getToken: GetToken = ({secret, ...args}) => {
  const {canonicalHeadersKeysString, signString} = getSignString(args);

  return {canonicalHeadersKeysString, sign: initSign(secret)(signString)};
};
