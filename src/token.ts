import * as cryptoJs from 'crypto-js';
import { getCanonicalHeaders } from './headers';
import { GetSignString, GetToken, InitSign } from './interface/token.interface';

const initSign: InitSign = secret => signString =>
  cryptoJs.HmacSHA256(signString, secret).toString(cryptoJs.enc.Base64);

const getSignString: GetSignString = ({method, url, headers}) => {
  const search = decodeURIComponent(new URL(url).search);
  const {
    canonicalHeadersKeysString,
    canonicalHeadersString,
  } = getCanonicalHeaders({prefix: 'x-ca-'}, headers);

  return {
    canonicalHeadersKeysString,
    signString: [
      method,
      headers['accept'],
      headers['content-type'],
      headers['content-md5'],
      headers['date'],
      canonicalHeadersString,
      search,
    ].join('\n'),
  };
};

export const getToken: GetToken = ({secret, ...args}) => {
  const {canonicalHeadersString, signString} = getSignString(args);

  return   {canonicalHeadersString,sign:initSign(secret)(signString);}
};
