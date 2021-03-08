'use strict'

import * as assert from 'assert'
import * as sinon from 'sinon'
import * as util from '../src/util'

const { getHeaders, getToken, getCanonicalHeaders, getSign, md5 } = util

describe('test/util.test.ts', () => {
  it('Should be the result of getHeaders.', async () => {
    const validationResult = (result: Record<string, unknown>) => {
      assert(typeof result === 'object')
      assert(typeof result['x-ca-timestamp'] === 'string')
      assert(typeof result.date === 'string')
      assert(result['x-ca-key'] === 'test')
      assert(result['x-ca-stage'] === 'TEST')
      assert(result.a === 'test')
    }

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

      assert(result['content-md5'] === 'sign')
      assert(typeof result['x-ca-nonce'] === 'string')
      assert(result['content-type'] === 'application/json; charset=UTF-8')
      assert(result.accept === 'application/json; charset=UTF-8')
      validationResult(result)

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

      assert(result['content-md5'] === 'sign')
      assert(result.accept === 'application/json; charset=UTF-8')
      assert(result['content-type'] === 'application/json; charset=UTF-8')
      validationResult(result)

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

      assert(result['content-md5'] === '')
      assert(result['content-type'] === 'application/text; charset=UTF-8')
      assert(result.accept === 'application/text; charset=UTF-8')
      validationResult(result)

      sinon.restore()
    }

    presenceRequestType()
    noRequestTypeExists()
    otherRequestType()
  })

  it('Should be the result of getToken.', async () => {
    sinon.stub(util, 'getCanonicalHeaders').returns({
      canonicalHeaderKeys: ['x-ca-key', 'x-ca-stage'],
      canonicalHeaderString: 'test1test2'
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
    assert(result['x-ca-signature-headers'] === 'x-ca-keyx-ca-stage')

    sinon.restore()
  })

  it('Should be the result of getCanonicalHeaders.', async () => {
    const result = getCanonicalHeaders('x-ca-', {
      'x-ca-timestamp': 'test',
      'x-ca-key': 'test',
      'x-ca-stage': 'test'
    })

    assert(typeof result === 'object')
    assert(result.canonicalHeaderString === 'testtesttest')
    assert(
      result.canonicalHeaderKeys.sort().toString() ===
        ['x-ca-timestamp', 'x-ca-key', 'x-ca-stage'].sort().toString()
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

// import * as assert from 'assert'
// import {
//   validateId,
//   timeDiff,
//   newTimestamp,
//   nextMillisecond,
//   timeEqual,
//   isNextMillisecond,
//   generateId,
//   error,
//   snowflake
// } from '../src/gateway'

// describe('test/snowflake.test.ts', () => {
//   it('Should be the result of validateId', async () => {
//     const result = validateId({
//       id: BigInt(3),
//       maxId: BigInt(2),
//       message: '${maxId}'
//     })

//     assert(result === '2')
//   })

//   it('Should be the result of timeDiff', async () => {
//     const result = timeDiff(BigInt(1), BigInt(2))

//     assert(result === 'Clock moves backwards to reject the id generated for 1.')
//   })

//   it('Should be the result of timeEqual', async () => {
//     const result = timeEqual({
//       timestamp: BigInt(1),
//       lastTimestamp: BigInt(1),
//       sequence: BigInt(0),
//       maxSequence: BigInt(0)
//     })

//     assert(typeof result === 'object')
//     assert(typeof result.sequence === 'bigint')
//     assert(typeof result.timestamp === 'bigint')
//   })

//   it('Should be the result of isNextMillisecond', async () => {
//     const result = isNextMillisecond({
//       timestamp: BigInt(1),
//       lastTimestamp: BigInt(1),
//       sequence: BigInt(0),
//       maxSequence: BigInt(0)
//     })

//     assert(typeof result === 'object')
//     assert(typeof result.sequence === 'bigint')
//     assert(typeof result.timestamp === 'bigint')
//   })

//   it('Should be the result of nextMillisecond', async () => {
//     const result = nextMillisecond(BigInt(Date.now()))

//     assert(typeof result === 'bigint')
//   })

//   it('Should be the result of newTimestamp', async () => {
//     const result = newTimestamp()

//     assert(typeof result === 'bigint')
//   })

//   it('Should be the result of generateId', async () => {
//     const result = generateId(
//       {
//         twEpoch: BigInt(1583734327332),
//         timestampLeftShift: BigInt(22),
//         dataCenterId: BigInt(0),
//         dataCenterLeftShift: BigInt(17),
//         workerId: BigInt(0),
//         workerLeftShift: BigInt(12)
//       },
//       { timestamp: BigInt(1609430400000), sequence: BigInt(0) }
//     )

//     assert(typeof result === 'object')
//     assert(typeof result.id === 'bigint')
//     assert(typeof result.lastTimestamp === 'bigint')
//     assert(typeof result.sequence === 'bigint')
//   })

//   it('Should be the result of error', async () => {
//     try {
//       error('error')
//     } catch (error) {
//       assert(error.message === 'error')
//     }
//   })

//   it('Should be the result of snowflake', async () => {
//     const generateId = snowflake({ twEpoch: 1577808000000 })
//     const ids: string[] = []

//     for (let index = 0; index < 200000; index++) {
//       const id = generateId()

//       ids.push(id)
//     }

//     assert([...new Set(ids)].length === 200000)
//   })
// })
