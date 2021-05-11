import * as assert from 'assert';
import {initRequest} from '../src/request';

describe('test/request.test.ts', () => {
  it('should be the result of the default option response status 200', async () => {
    const result = await initRequest({
      appKey: '223333',
      appSecret: '197876',
    })('https://www.bing.com/', {method: 'GET'});

    assert(result.status === 200);
  });

  it('should be the result of custom option response status 200', async () => {
    const result = await initRequest({
      appKey: '223333',
      appSecret: '197876',
    })('https://www.bing.com/');

    assert(result.status === 200);
  });
});
