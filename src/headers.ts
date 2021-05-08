import {FetchOptions} from '@leaf-x/fetch';
import * as uuid from 'uuid';
import {
  GetCanonicalHeaders,
  InitGetRequestHeaders,
  InitSpliceCanonicalHeaders,
} from './interface/headers.interface';

const initSpliceCanonicalHeaders: InitSpliceCanonicalHeaders = headers => key =>
  `${key}:${headers[key]}`;

export const initGetRequestHeaders: InitGetRequestHeaders = ({
  appKey,
  stage,
}) => ({headers, body}: FetchOptions) => {
  const data =
    typeof body === 'object' && body !== null ? JSON.stringify(body) : body;

  const contentMD5 = data
    ? CryptoJS.MD5(data).toString(CryptoJS.enc.Base64)
    : '';

  return {
    'x-ca-nonce': uuid.v4(),
    'x-ca-timestamp': Date.now().toString(),
    'x-ca-key': appKey,
    'x-ca-stage': stage,
    'content-type': headers ? headers['content-type'] : '',
    'content-md5': contentMD5,
    accept: 'application/json; charset=UTF-8',
  };
};

export const getCanonicalHeaders: GetCanonicalHeaders = ({prefix}, headers) => {
  const spliceCanonicalHeaders = initSpliceCanonicalHeaders(headers);
  const canonicalHeadersKeys = Object.keys(headers);

  return {
    canonicalHeadersKeysString: canonicalHeadersKeys.join(),
    canonicalHeadersString: canonicalHeadersKeys
      .filter(key => key.startsWith(prefix))
      .sort()
      .map(spliceCanonicalHeaders)
      .join('\n'),
  };
};
