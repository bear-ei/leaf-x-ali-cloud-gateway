import * as crypto from 'crypto';
import {getCanonicalHeaders} from './headers';
import {GetSignString, GetToken, InitSign} from './interface/token.interface';

const initSign: InitSign = secret => signString =>
  crypto
    .createHmac('sha256', secret)
    .update(signString, 'utf8')
    .digest('base64');

const getSignString: GetSignString = ({method, url, headers}) => {
  const {searchParams, pathname} = new URL(url);
  const queryParams = {} as Record<string, unknown>;
  const {canonicalHeadersKeysString, canonicalHeadersString} =
    getCanonicalHeaders({prefix: 'x-ca-'}, headers);

  for (const key of searchParams.keys()) {
    Object.assign(queryParams, {[key]: searchParams.get(key)});
  }

  const search = Object.keys(queryParams)
    .sort()
    .map(key => `${key}=${queryParams[key]}`)
    .join('&');

  return {
    canonicalHeadersKeysString,
    signString: [
      method,
      headers['accept'],
      headers['content-md5'],
      headers['content-type'],
      headers['date'],
      canonicalHeadersString,
      decodeURIComponent(search ? `${pathname}?${search}` : pathname),
    ].join('\n'),
  };
};

export const getToken: GetToken = ({secret, ...args}) => {
  const {canonicalHeadersKeysString, signString} = getSignString(args);

  return {canonicalHeadersKeysString, sign: initSign(secret)(signString)};
};
