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

// request
const result = await request('https://www.leaf-x.app/');

console.info(result);

// socket
socket.connect();

socket.on('open', (data) => {
    console.info(data.success);
});

socket.on('close', (data) => {
    console.info(data.success);
});


socket.on('error', (data) => {
    console.info(data.success);
});


socket.on('message', (message) => {
    console.info(message);
});

socket.on('error', (error) => {
    console.info(error);
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
