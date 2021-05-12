import * as assert from 'assert';
import * as nock from 'nock';
import {initRequest} from '../src/request';

const good = 'hello world';

describe('test/request.test.ts', () => {
  before(async () => {
    nock('https://leaf-x.app').get('/default/succeed').reply(200, good);
    nock('https://leaf-x.app').get('/custom/succeed').reply(200, good);
  });

  it('should be the result of the default options response status 200', async () => {
    const result = await initRequest({
      appKey: '223333',
      appSecret: '197876',
    })('https://leaf-x.app/default/succeed', {method: 'GET'});

    assert(result.status === 200);
  });

  it('should be the result of custom options response status 200', async () => {
    const result = await initRequest({
      appKey: '223333',
      appSecret: '197876',
    })('https://leaf-x.app/custom/succeed');

    assert(result.status === 200);
  });
});
