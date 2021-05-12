import {gateway as relGateway} from './gateway';
export * from './interface/gateway.interface';
export * from './interface/headers.interface';
export * from './interface/request.interface';
export * from './interface/token.interface';
export {gateway};

const gateway = relGateway;
