// 'use strict'

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
