import * as assert from 'assert';
import {gateway} from '../src/gateway';

describe('test/gateway.test.ts', () => {
  it('should be the result of the gateway default options', async () => {
    const result = gateway({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
    });

    assert(typeof result === 'object');
    assert(typeof result.request === 'function');
  });

  it('should be the result of the gateway customization options', async () => {
    const result = gateway({
      appKey: '1234455',
      appSecret: 'MTIzNDQ1NQ==',
      stage: 'RELEASE',
      timeout: 3000,
    });

    assert(typeof result === 'object');
    assert(typeof result.request === 'function');
  });
});
