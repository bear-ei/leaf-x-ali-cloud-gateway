import * as assert from 'assert';
import {handleToken} from './../src/token';

describe('test/token.test.ts', () => {
  it('should get the request token', async () => {
    const result = handleToken({
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
