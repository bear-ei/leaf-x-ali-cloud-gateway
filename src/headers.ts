import {FetchOptions} from '@leaf-x/fetch';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import {
  GetCanonicalHeaders,
  InitGetRequestHeaders,
  InitSpliceCanonicalHeaders,
} from './interface/headers.interface';

const initSpliceCanonicalHeaders: InitSpliceCanonicalHeaders = headers => key =>
  `${key}:${headers[key]}`;

export const initGetRequestHeaders: InitGetRequestHeaders =
  ({appKey, stage, headers: defaultHeaders}) =>
  ({headers, body}: FetchOptions) => {
    const contentMD5 = body
      ? crypto.createHash('md5').update(body.toString(), 'utf-8').digest('hex')
      : '';

    return {
      'x-ca-nonce': uuid.v4(),
      'x-ca-timestamp': Date.now().toString(),
      'x-ca-key': appKey,
      'x-ca-stage': stage,
      'content-type':
        (headers as Record<string, string>)?.['content-type'] ??
        'application/json; charset=utf-8',
      'content-md5': contentMD5,
      accept: (headers as Record<string, string>)?.accept ?? '*/*',
      date: (headers as Record<string, string>)?.date ?? '',
      ...headers,
      ...defaultHeaders,
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
