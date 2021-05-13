import {FetchOptions} from '@leaf-x/fetch';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import {
  DelHeaders,
  GetCanonicalHeaders,
  GetHeaders,
  InitGetRequestHeaders,
  InitSpliceCanonicalHeaders,
  SetHeaders,
} from './interface/headers.interface';

const HEADERS = {} as Record<string, string>;
const initSpliceCanonicalHeaders: InitSpliceCanonicalHeaders = headers => key =>
  `${key}:${headers[key]}`;

export const initGetRequestHeaders: InitGetRequestHeaders =
  ({appKey, stage, headers: defaultHeaders}) =>
  ({headers, data}: FetchOptions) => {
    const json = typeof data === 'object' && data !== null;
    const contentMD5 = data
      ? crypto
          .createHash('md5')
          .update((json ? JSON.stringify(data) : `${data}`) as string)
          .digest('base64')
      : '';

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
      ...headers,
      ...defaultHeaders,
      ...HEADERS,
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

export const setHeaders: SetHeaders = (key, val) =>
  Object.assign(HEADERS, {[key]: val});

export const delHeaders: DelHeaders = key => {
  delete HEADERS[key];

  return HEADERS;
};

export const getHeaders: GetHeaders = key => HEADERS[key];
