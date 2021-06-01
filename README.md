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

const {request,socket} = gateway({
  appKey: '2135455621223',
  appSecret: 'MjEzNTQ1NTYyMTIyMw==',
  stage: "RELEASE,
});

// Request
await request('https://www.leaf-x.app/').then(result=> console.info(result));

// Socket
socket.connect();

socket.on('OPEN', (success: string) => {
// do something
});

socket.on('CLOSE', (success: string) => {
// do something
});

socket.on('MESSAGE', (message: string) => {
 // do something
});

socket.on('ERROR', (error: Record<string, unknown>) => {
// do something
});

socket.on('SIGN_UP', (success: string) => {
// do something
});

socket.on('SIGN_OUT', (success: string) => {
// do something
});

socket.on('HEARTBEAT', (success: string) => {
// do something
});

SOCKET.on('RECONNECT', (success: string) => {
// do something
});

SOCKET.on('SEND', (data: Record<string, unknown>) => {
// do something
});

socket.send("https://www.leaf-x.app/");

socket.close();
```

## React Native

> npm install @leaf-x/ali-cloud-gateway --save
> npm install react-native-url-polyfill --save

```typescript
import 'react-native-url-polyfill/auto';
```

### [react-native-crypto](https://github.com/tradle/react-native-crypto)

> npm install --save react-native-crypto

#### install peer deps

> npm install --save react-native-randombytes
> react-native link react-native-randombytes # on RN >= 0.60, instead do: cd iOS && pod install

#### install latest rn-nodeify

> npm install --save-dev rn-nodeify

#### install node core shims and recursively hack package.json files

#### in ./node_modules to add/update the "browser"/"react-native" field with relevant mappings

> ./node_modules/.bin/rn-nodeify --hack --install

#### rn-nodeify will create a shim.js in the project root directory

```typescript
// index.ios.js or index.android.js
// make sure you use `import` and not require!
import './shim.js';
import crypto from 'crypto';
// ...the rest of your code
```
