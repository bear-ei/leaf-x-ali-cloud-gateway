import {FetchOptions} from '@leaf-x/fetch';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import {
  GetCanonicalHeaders,
  InitGetHeaders,
  InitGetRequestHeaders,
  InitSpliceCanonicalHeaders,
} from './interface/headers.interface';
import {HttpMethod} from './interface/request.interface';
import {getToken} from './token';

const HEADERS = new Map();
const initSpliceCanonicalHeaders: InitSpliceCanonicalHeaders = headers => key =>
  `${key}:${headers[key]}`;

const initGetHeaders: InitGetHeaders =
  ({appKey, stage, headers: defaultHeaders}) =>
  ({headers, data}: FetchOptions) => {
    const addHeaders = {} as Record<string, string>;
    const json = typeof data === 'object' && data !== null;
    const contentMD5 = data
      ? crypto
          .createHash('md5')
          .update((json ? JSON.stringify(data) : `${data}`) as string)
          .digest('base64')
      : '';

    for (const key of HEADERS.keys()) {
      Object.assign(addHeaders, {[key]: HEADERS.get(key)});
    }

    return {
      'x-ca-nonce': uuid.v4(),
      'x-ca-timestamp': `${Date.now()}`,
      'x-ca-key': appKey,
      'x-ca-stage': stage,
      'content-type':
        (headers as Record<string, string>)?.['content-type'] ??
        'application/json; charset=utf-8',
      'content-md5': contentMD5,
      accept: (headers as Record<string, string>)?.accept ?? '*/*',
      date: '',
      ...defaultHeaders,
      ...addHeaders,
      ...headers,
    };
  };

export const getCanonicalHeaders: GetCanonicalHeaders = ({prefix}, headers) => {
  const spliceCanonicalHeaders = initSpliceCanonicalHeaders(headers);
  const canonicalHeadersKeys = Object.keys(headers)
    .filter(key => key.startsWith(prefix))
    .sort();

  return {
    canonicalHeadersKeysString: canonicalHeadersKeys.join(),
    canonicalHeadersString: canonicalHeadersKeys
      .map(spliceCanonicalHeaders)
      .join('\n'),
  };
};

export const initGetRequestHeaders: InitGetRequestHeaders =
  gatewayOptions =>
  ({headers, data, url, method = 'GET'}) => {
    const requestHeaders = initGetHeaders(gatewayOptions)({
      headers,
      data,
    });

    const {canonicalHeadersKeysString, sign} = getToken({
      url,
      secret: gatewayOptions.appSecret,
      method: method.toLocaleUpperCase() as HttpMethod,
      headers: requestHeaders,
    });

    return {
      ...requestHeaders,
      'x-ca-signature': sign,
      'x-ca-signature-headers': canonicalHeadersKeysString,
    };
  };

export {HEADERS};
