import * as assert from 'assert';
import {getCanonicalHeaders, initGetRequestHeaders} from '../src/headers';

describe('test/headers.test.ts', () => {
  it('should get the request headers', async () => {
    const result = initGetRequestHeaders({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
      stage: 'RELEASE',
    })({
      url: 'https://leaf-x.app',
      host: 'leaf-x.app',
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

  it('should be a text data request headers', async () => {
    const result = initGetRequestHeaders({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
      stage: 'RELEASE',
    })({
      url: 'https://leaf-x.app',
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

  it('should be obtained from the canonical header', async () => {
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
});
