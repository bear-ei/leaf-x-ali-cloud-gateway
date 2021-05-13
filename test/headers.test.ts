import * as assert from 'assert';
import {
  delHeaders,
  getCanonicalHeaders,
  getHeaders,
  initGetRequestHeaders,
  setHeaders,
} from '../src/headers';

describe('test/headers.test.ts', () => {
  it('should be the result of the default options in the request headers', async () => {
    const result = initGetRequestHeaders({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
      stage: 'RELEASE',
    })({});

    assert(typeof result === 'object');
    assert(typeof result['x-ca-nonce'] === 'string');
    assert(typeof result['x-ca-timestamp'] === 'string');
    assert(result['x-ca-key'] === '1234455');
    assert(result['x-ca-stage'] === 'RELEASE');
    assert(result['content-type'] === 'application/json; charset=utf-8');
    assert(result['content-md5'] === '');
    assert(result['accept'] === '*/*');
    assert(typeof result['date'] === 'string');
  });

  it('should be the result of the custom option JSON data in the request header', async () => {
    const result = initGetRequestHeaders({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
      stage: 'RELEASE',
    })({
      headers: {
        'content-type': 'application/json; charset=utf-8',
        accept: '*/*',
        date: '',
      },
      data: {test: 'test'},
    });

    assert(typeof result === 'object');
    assert(typeof result['x-ca-nonce'] === 'string');
    assert(typeof result['x-ca-timestamp'] === 'string');
    assert(result['x-ca-key'] === '1234455');
    assert(result['x-ca-stage'] === 'RELEASE');
    assert(result['content-type'] === 'application/json; charset=utf-8');
    assert(typeof result['content-md5'] === 'string');
    assert(result['accept'] === '*/*');
    assert(typeof result['date'] === 'string');
  });

  it('should be the result of the custom option text data in the request header', async () => {
    const result = initGetRequestHeaders({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
      stage: 'RELEASE',
    })({
      headers: {
        'content-type': 'application/json; charset=utf-8',
        accept: '*/*',
        date: '',
      },
      data: JSON.stringify({test: 'test'}),
    });

    assert(typeof result === 'object');
    assert(typeof result['x-ca-nonce'] === 'string');
    assert(typeof result['x-ca-timestamp'] === 'string');
    assert(result['x-ca-key'] === '1234455');
    assert(result['x-ca-stage'] === 'RELEASE');
    assert(result['content-type'] === 'application/json; charset=utf-8');
    assert(typeof result['content-md5'] === 'string');
    assert(result['accept'] === '*/*');
    assert(typeof result['date'] === 'string');
  });

  it('should be getting the headers results of the canonical request', async () => {
    const result = getCanonicalHeaders(
      {prefix: 'x-ca-'},
      {
        'x-ca-nonce': '3a9d60c9-1dfc-494c-ac56-6a995034c303',
        'x-ca-timestamp': '1620702566222',
        'x-ca-key': '1234455',
        'x-ca-stage': 'RELEASE',
        'content-type': 'application/json; charset=utf-8',
        'content-md5': '',
        accept: '*/*',
        date: '',
      }
    );

    assert(typeof result === 'object');
    assert(
      result.canonicalHeadersKeysString ===
        ['x-ca-key', 'x-ca-nonce', 'x-ca-stage', 'x-ca-timestamp'].join()
    );

    assert(
      result.canonicalHeadersString ===
        [
          'x-ca-key:1234455',
          'x-ca-nonce:3a9d60c9-1dfc-494c-ac56-6a995034c303',
          'x-ca-stage:RELEASE',
          'x-ca-timestamp:1620702566222',
        ].join('\n')
    );
  });

  it('should be the result of setting up a global header request', async () => {
    const result = setHeaders('token', 'token');

    assert(result.token === 'token');
  });

  it('should be the result of setting up a global header request', async () => {
    const result = getHeaders('token');

    assert(result === 'token');
  });

  it('should get the result of the global request', async () => {
    const result = getHeaders('token');

    assert(result === 'token');
  });

  it('should be the result of deleting a global request', async () => {
    const result = delHeaders('token');

    assert(!result.token);
  });
});
