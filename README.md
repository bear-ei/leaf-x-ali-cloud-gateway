# Snowflake

Twitter snowflake algorithm TypeScript implementation

## Installation

> npm install @leaf-x/snowflake --save

## Parameters

| Name         |  Default Value |   Description   |
| :----------- | -------------: | :-------------: |
| dataCenterId |              0 | Data center id  |
| workerId     |              0 | Work machine id |
| twEpoch      | Required field | Start timestamp |

## Use

```typescript
import * as snowflake from '@leaf-x/snowflake'

const generateId = snowflake({
  dataCenterId: 0,
  workerId: 0,
  twEpoch: 1583734327332
})

const id = generateId()

console.info(id)
```
