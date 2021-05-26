import * as assert from 'assert';
import * as nock from 'nock';
import {headers as globalHeaders} from '../src/headers';
import {initRequest} from '../src/request';

describe('test/request.test.ts', () => {
  before(async () => {
    const good = 'hello world';

    nock('https://leaf-x.app').get('/default/succeed').reply(200, good);
    nock('https://leaf-x.app').get('/custom/succeed').reply(200, good);
    nock('https://leaf-x.app').post('/data').reply(200, good);
    nock('https://leaf-x.app').post('/body').reply(200, good);
  });

  it('should be the default request', async () => {
    globalHeaders.set('test', 'test');

    await initRequest({
      appKey: '223333',
      appSecret: '197876',
    })('https://leaf-x.app/default/succeed', {method: 'GET'}).then(result =>
      assert(result.status === 200)
    );
  });

  it('should be a custom option request', async () => {
    await initRequest({
      appKey: '223333',
      appSecret: '197876',
    })('https://leaf-x.app/custom/succeed').then(result =>
      assert(result.status === 200)
    );
  });

  it('should be a post data request', async () => {
    await initRequest({
      appKey: '223333',
      appSecret: '197876',
    })('https://leaf-x.app/data', {
      method: 'POST',
      data: {},
    }).then(result => assert(result.status === 200));
  });

  it('should be a post body request', async () => {
    await initRequest({
      appKey: '223333',
      appSecret: '197876',
    })('https://leaf-x.app/body', {
      method: 'POST',
      body: 'ok',
    }).then(result => assert(result.status === 200));
  });
});
