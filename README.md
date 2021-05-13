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
| timeout   |           3000 | Set the global request timeout.           |
| headers   |                | Set the global request headers.           |

## Use

```typescript
import {gateway} from '@leaf-x/ali-cloud-gateway';

const {request} = gateway({
  appKey: '2135455621223',
  appSecret: 'MjEzNTQ1NTYyMTIyMw==',
  stage: "RELEASE,
});

const result = await request('https://www.leaf-x.app/');

console.info(result);
```
