'use strict'
import * as assert from 'assert'
import axios, { AxiosResponse } from 'axios'
import * as sinon from 'sinon'
import * as client from '../src'
import * as util from '../src/util'

const { gateway, request } = client

describe('test/index.test.ts', () => {
  it('Should be the result of gateway.', async () => {
    const defaultOptions = () => {
      sinon
        .stub(client, 'request')
        .returns(async () => ('' as unknown) as AxiosResponse<unknown>)

      const result = gateway({
        appKey: 'test',
        appSecret: 'test'
      })

      assert(typeof result.request === 'function')

      sinon.restore()
    }

    const inputOptions = () => {
      sinon
        .stub(client, 'request')
        .returns(async () => ('' as unknown) as AxiosResponse<unknown>)

      const result = gateway({
        appKey: 'test',
        appSecret: 'test',
        stage: 'RELEASE',
        nonce: true,
        defaultHeaders: {},
        baseUrl: 'https://www.test.com/',
        url: 'https://www.test.com/api',
        timeout: 3000
      })

      assert(typeof result.request === 'function')

      sinon.restore()
    }

    defaultOptions()
    inputOptions()
  })

  it('Should be the result of request.', async () => {
    const defaultOptions = async () => {
      sinon.stub(util, 'getHeaders').returns({ 'x-ca-key': 'test' })
      sinon
        .stub(util, 'getToken')
        .returns({ 'x-ca-signature': 'test', 'x-ca-signature-headers': 'test' })
      sinon.stub(axios, 'request').resolves({ data: 'test' })

      const result = await request({
        appKey: 'test',
        appSecret: 'test'
      })('/api', {})

      assert(result.data === 'test')

      sinon.restore()
    }

    const inputOptions = async () => {
      sinon.stub(util, 'getHeaders').returns({ 'x-ca-key': 'test' })
      sinon
        .stub(util, 'getToken')
        .returns({ 'x-ca-signature': 'test', 'x-ca-signature-headers': 'test' })
      sinon.stub(axios, 'request').resolves({ data: 'test' })

      const result = await request({
        appKey: 'test',
        appSecret: 'test',
        stage: 'RELEASE',
        nonce: true,
        defaultHeaders: {},
        baseUrl: 'https://www.test.com/',
        url: 'https://www.test.com/api',
        timeout: 3000
      })('/api', {})

      assert(result.data === 'test')

      sinon.restore()
    }

    await defaultOptions()
    await inputOptions()
  })

  //   it('Should be the result of cc.', async () => {
  //     const req = gateway({
  //       appKey: '203802925',
  //       appSecret: 'PPrVWfM9whsiWZGQICcEZU1Nw7sthrAM',
  //       baseUrl: 'https://dev.api.thallonet.com'
  //     })
  //     console.time()
  //     try {
  //       const result = await req.request('/v3/protocols', {
  //         method: 'get',
  //         headers: {
  //           'X-Token':
  //             'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlRhUm90LTIwMjAtMTU4NTU1MDE0MjAwMCJ9.eyJhdXRob3JpemF0aW9uIjoiMTQzNjE5NzQ4MDEzNjcwNCIsImlzcyI6Imh0dHBzOi8vYXBpLnRoYWxsb25ldC5jb20iLCJpYXQiOjE2MTQzMzY0MjgsImV4cCI6MTYxNjkyODQyOH0.I73rCdpxFlP9YwlyTlujdY2OOzdMJPk4HWvbOt3vMZcoebjDAX6Wuip8YX5NFQEzyJKZ4cwL8iT1nHZ3A5dfuwGdrC0E1osOBsndd-qfqJLY26INfehEIu2Mfx12DCN7MezUqqiWtBIGUwlnWfC_eCHUufF0_Z1TW_NlCFCaVXaaqO2VxOmwbn4fUUHsnBTQ-0VzBr1ZLWpt90hG2kY9QpIQ_n4QSNGCTJAr-9v1cEZuEK4190AGazbuGtlB-1Qu1jqF91C0KGpwjwhqCf0AxPGHZl_bB0pHVOePa71sSV0J-d0Um6etEeHz-l74A8wV7nBY3ADhNon0JDPW4_wzLQ'
  //         },

  //         params: { test: 'tes', test1: 'tes' },
  //         data: { test: '233' }
  //       })

  //       result
  //     } catch (error) {
  //       //   console.info(error.response)
  //     }
  //     console.timeEnd()
  //   })
})
