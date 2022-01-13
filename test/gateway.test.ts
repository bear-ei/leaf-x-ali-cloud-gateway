import * as assert from 'assert';
import {gateway} from '../src/gateway';

describe('test/gateway.test.ts', () => {
  it('should be the default API gateway options', async () => {
    const result = gateway({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
    });

    assert(typeof result === 'object');
    assert(typeof result.request === 'function');
  });

  it('should be an API gateway customization options', async () => {
    const result = gateway({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
      stage: 'RELEASE',
      timeout: 3000,
      baseUrl: 'https://leaf-x.com',
    });

    assert(typeof result === 'object');
    assert(typeof result.request === 'function');
  });
});
