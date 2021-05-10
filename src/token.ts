import * as cryptoJs from 'crypto-js';
import {getCanonicalHeaders} from './headers';
import {GetSignString, GetToken, InitSign} from './interface/token.interface';

const initSign: InitSign = secret => signString =>
  cryptoJs.HmacSHA256(signString, secret).toString(cryptoJs.enc.Base64);

const getSignString: GetSignString = ({method, url, headers}) => {
  const {search, pathname} = new URL(url);
  const {
    canonicalHeadersKeysString,
    canonicalHeadersString,
  } = getCanonicalHeaders({prefix: 'x-ca-'}, headers);

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
