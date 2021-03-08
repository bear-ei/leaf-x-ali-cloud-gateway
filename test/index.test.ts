// 'use strict'

// import * as assert from 'assert'
// import axios from 'axios'
// import * as sinon from 'sinon'
// import * as client from '../src'
// import * as util from '../src/util'
// const { gateway, request } = client

// describe('test/index.test.ts', () => {
//   it('Should be the result of gateway.', async () => {
//     sinon.stub(client, 'request').returns(async () => ('' as unknown) as any)

//     const defaultOptions = () => {
//       const result = gateway({
//         appKey: 'test',
//         appSecret: 'test'
//       })

//       assert(typeof result.request === 'function')
//     }

//     const inputOptions = () => {
//       const result = gateway({
//         appKey: 'test',
//         appSecret: 'test',
//         stage: 'RELEASE',
//         nonce: true,
//         defaultHeaders: {},
//         baseUrl: 'https://www.test.com/',
//         url: 'https://www.test.com/api',
//         timeout: 3000
//       })

//       assert(typeof result.request === 'function')
//     }

//     defaultOptions()
//     inputOptions()

//     sinon.restore()
//   })

//   it('Should be the result of request.', async () => {
//     sinon.stub(util, 'getHeaders').returns({ 'x-ca-key': 'test' })
//     sinon
//       .stub(util, 'getToken')
//       .returns({ 'x-ca-signature': 'test', 'x-ca-signature-headers': 'test' })
//     sinon.stub(axios, 'request').resolves({ data: 'test' })

//     const result = await request({
//       appKey: 'test',
//       appSecret: 'test',
//       stage: 'RELEASE',
//       nonce: true,
//       defaultHeaders: {},
//       baseUrl: 'https://www.test.com/',
//       url: 'https://www.test.com/api',
//       timeout: 3000
//     })('/api', {})

//     assert(result.data === 'test')

//     sinon.restore()
//   })
// })
