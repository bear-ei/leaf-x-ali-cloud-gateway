'use strict'

import * as assert from 'assert'
import * as sinon from 'sinon'
import * as util from '../src/util'

const { getHeaders, getToken, getCanonicalHeaders, getSign, md5 } = util

describe('test/util.test.ts', () => {
  it('Should be the result of getHeaders.', async () => {
    const presenceRequestType = () => {
      sinon.stub(util, 'md5').returns('sign')

      const result = getHeaders({
        appKey: 'test',
        stage: 'TEST',
        body: JSON.stringify({ message: 'ok' }),
        headers: {
          a: 'test',
          'content-type': 'application/json; charset=UTF-8'
        },
        nonce: true
      })

      assert(typeof result === 'object')
      assert(result['content-md5'] === 'sign')
      assert(typeof result['x-ca-nonce'] === 'string')
      assert(result['content-type'] === 'application/json; charset=UTF-8')
      assert(result.accept === 'application/json; charset=UTF-8')
      assert(typeof result['x-ca-timestamp'] === 'string')
      assert(typeof result.date === 'string')
      assert(result['x-ca-key'] === 'test')
      assert(result['x-ca-stage'] === 'TEST')
      assert(result.a === 'test')

      sinon.restore()
    }

    const noRequestTypeExists = () => {
      sinon.stub(util, 'md5').returns('sign')

      const result = getHeaders({
        appKey: 'test',
        stage: 'TEST',
        body: JSON.stringify({ message: 'ok' }),
        headers: { a: 'test' },
        nonce: false
      })

      assert(typeof result === 'object')
      assert(result['content-md5'] === 'sign')
      assert(result.accept === 'application/json; charset=UTF-8')
      assert(result['content-type'] === 'application/json; charset=UTF-8')
      assert(typeof result['x-ca-timestamp'] === 'string')
      assert(typeof result.date === 'string')
      assert(result['x-ca-key'] === 'test')
      assert(result['x-ca-stage'] === 'TEST')
      assert(result.a === 'test')

      sinon.restore()
    }

    const otherRequestType = () => {
      sinon.stub(util, 'md5').returns('sign')

      const result = getHeaders({
        appKey: 'test',
        stage: 'TEST',
        body: '',
        headers: {
          a: 'test',
          'content-type': 'application/text; charset=UTF-8',
          accept: 'application/text; charset=UTF-8'
        },
        nonce: false
      })

      assert(typeof result === 'object')
      assert(result['content-md5'] === '')
      assert(result['content-type'] === 'application/text; charset=UTF-8')
      assert(result.accept === 'application/text; charset=UTF-8')
      assert(typeof result['x-ca-timestamp'] === 'string')
      assert(typeof result.date === 'string')
      assert(result['x-ca-key'] === 'test')
      assert(result['x-ca-stage'] === 'TEST')
      assert(result.a === 'test')

      sinon.restore()
    }

    presenceRequestType()
    noRequestTypeExists()
    otherRequestType()
  })

  it('Should be the result of getToken.', async () => {
    const existenceParameters = () => {
      sinon.stub(util, 'getCanonicalHeaders').returns({
        canonicalHeaderKeys: ['x-ca-key', 'x-ca-stage'],
        canonicalHeaderString: 'x-ca-key:test1\nx-ca-stage:test2'
      })

      sinon.stub(util, 'getSign').returns('sign')

      const result = getToken({
        method: 'get',
        headers: { a: 'test' },
        url: 'http:https://www.test.com',
        appSecret: 'test',
        params: { test: 'test' }
      })

      assert(typeof result === 'object')
      assert(result['x-ca-signature'] === 'sign')
      assert(result['x-ca-signature-headers'] === 'x-ca-key,x-ca-stage')

      sinon.restore()
    }

    const noParametersExist = () => {
      sinon.stub(util, 'getCanonicalHeaders').returns({
        canonicalHeaderKeys: ['x-ca-key', 'x-ca-stage'],
        canonicalHeaderString: 'x-ca-key:test1\nx-ca-stage:test2'
      })

      sinon.stub(util, 'getSign').returns('sign')

      const result = getToken({
        method: 'get',
        headers: { a: 'test' },
        url: 'http:https://www.test.com',
        appSecret: 'test'
      })

      assert(typeof result === 'object')
      assert(result['x-ca-signature'] === 'sign')
      assert(result['x-ca-signature-headers'] === 'x-ca-key,x-ca-stage')

      sinon.restore()
    }

    existenceParameters()
    noParametersExist()
  })

  it('Should be the result of getCanonicalHeaders.', async () => {
    const headers = {
      'x-ca-timestamp': 'test',
      'x-ca-key': 'test',
      'x-ca-stage': 'test'
    } as Record<string, string>

    const result = getCanonicalHeaders('x-ca-', headers)
    const keys = ['x-ca-timestamp', 'x-ca-key', 'x-ca-stage']

    assert(typeof result === 'object')
    assert(
      result.canonicalHeaderString ===
        Object.keys(headers)
          .sort()
          .map((key) => `${key}:${headers[key]}`)
          .join('\n')
    )

    assert(
      result.canonicalHeaderKeys.sort().toString() === keys.sort().toString()
    )
  })

  it('Should be the result of getSign.', async () => {
    const result = getSign('sign', 'test')

    assert(typeof result === 'string')
  })

  it('Should be the result of md5.', async () => {
    const result = md5(Buffer.from('test'))

    assert(typeof result === 'string')
  })
})
