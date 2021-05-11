# Gateway

Ali cloud gateway.

## Installation

> npm install @leaf-x/ali-cloud-gateway --save

## Parameters

| Name      |  Default Value | Description                               |
| :-------- | -------------: | :---------------------------------------- |
| appKey    | Required field | Gateway authorization application key.    |
| appSecret | Required field | Gateway authorization application secret. |
| stage     |        RELEASE | Gateway runtime environment.              |

## Use

```typescript
import * as snowflake from '@leaf-x/snowflake';

const request = gateway({
  appKey: '2135455621223',
  appSecret: 'MjEzNTQ1NTYyMTIyMw==',
  twEpoch: 1583734327332,
});

const result = await request('https://www.bing.com/');

console.info(result);
```
