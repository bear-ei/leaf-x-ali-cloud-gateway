import * as assert from 'assert';
import * as nock from 'nock';
import {initRequest} from '../src/request';

describe('test/request.test.ts', () => {
  before(async () => {
    const good = 'hello world';

    nock('https://leaf-x.com').get('/default/succeed').reply(200, good);
    nock('https://leaf-x.com').get('/custom/succeed').reply(200, good);
    nock('https://leaf-x.com').post('/data').reply(200, good);
    nock('https://leaf-x.com').post('/body').reply(200, good);
  });

  it('should be the default request', async () => {
    const request = initRequest({
      appKey: '223333',
      appSecret: '197876',
    });

    await request('https://leaf-x.com/default/succeed', {method: 'GET'}).then(
      result => assert(result.status === 200)
    );
  });

  it('should be a custom options request', async () => {
    const request = initRequest({
      appKey: '223333',
      appSecret: '197876',
    });

    await request('https://leaf-x.com/custom/succeed').then(result =>
      assert(result.status === 200)
    );
  });

  it('should be a post data request', async () => {
    const request = initRequest({
      appKey: '223333',
      appSecret: '197876',
    });

    await request('https://leaf-x.com/data', {
      method: 'POST',
      data: {},
    }).then(result => assert(result.status === 200));
  });

  it('should be a post body request', async () => {
    const request = initRequest({
      appKey: '223333',
      appSecret: '197876',
    });

    await request('https://leaf-x.com/body', {
      method: 'POST',
      body: 'ok',
    }).then(result => assert(result.status === 200));
  });
});
