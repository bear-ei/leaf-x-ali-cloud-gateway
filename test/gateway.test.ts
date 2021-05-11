import * as assert from 'assert';
import {gateway} from '../src/gateway';

describe('test/serverless.test.ts', () => {
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
    });

    assert(typeof result === 'object');
    assert(typeof result.request === 'function');
  });

  it('should be the result of the gateway customization options', async () => {
    const result = gateway({
      appKey: '203802925',
      appSecret: 'PPrVWfM9whsiWZGQICcEZU1Nw7sthrAM',
      stage: 'RELEASE',
    });

    const result1 = await result.request(
      'https://dev.api.thallonet.com/v4/web/managements/updateLogs?test=test'
    );

    console.info(result1);

    assert(typeof result === 'object');
    assert(typeof result.request === 'function');
  });
});
