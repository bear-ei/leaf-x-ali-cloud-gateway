import * as assert from 'assert';
import {getToken} from '../src/token';

describe('test/token.test.ts', () => {
  it('should be the result of getting request token', async () => {
    const result = getToken({
      secret: 'MTIz',
      method: 'GET',
      url: 'https://github.com/',
      headers: {'content-type': 'application/octet-stream; charset=utf-8'},
    });

    assert(typeof result === 'object');
    assert(typeof result.canonicalHeadersKeysString === 'string');
    assert(typeof result.sign === 'string');
  });

  it('should be the result of getting request token', async () => {
    const result = getToken({
      secret: 'MTIz',
      method: 'GET',
      url: 'https://github.com/?test=test',
      headers: {'content-type': 'application/octet-stream; charset=utf-8'},
    });

    assert(typeof result === 'object');
    assert(typeof result.canonicalHeadersKeysString === 'string');
    assert(typeof result.sign === 'string');
  });
});