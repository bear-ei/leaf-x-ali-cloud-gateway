/**
 * Enumerate the socket command word.
 */
export enum CommandWord {
  /**
   * The API gateway returns a registration failure response.
   */
  RF = 'rf',

  /**
   * The client request volume reaches the API gateway flow control threshold,
   * the API gateway will send this command to the client, which requires the
   * client to actively disconnect and actively reconnect. Active reconnection
   * will not affect user experience. Otherwise, the API gateway will actively
   * disconnect the long connection soon after.
   */
  OS = 'os',

  /**
   * When the connection reaches the long connection lifecycle, the API gateway
   * will send this command to the client, requiring the client to actively
   * disconnect and actively reconnect. Active reconnection will not affect user
   * experience. Otherwise, the API gateway will actively disconnect the long
   * connection soon after.
   */
  CR = 'cr',

  /**
   * When the DeviceId registration is successful, the API gateway returns
   * success and the connection unique identifier and heartbeat interval
   * configuration.
   */
  RO = 'ro',

  /**
   * The API gateway returns a heartbeat hold success response signal.
   */
  HO = 'ho',

  /**
   * The API gateway returns a heartbeat hold failure response, which requires
   * the client to resend the registration request.
   */
  HF = 'hf',

  /**
   * The API gateway sends a downlink notification request.
   */
  NF = 'nf',
}

/**
 * Socket command word string.
 */
export type CommandWordString = 'RF' | 'OS' | 'CR' | 'RO' | 'HO' | 'HF' | 'NF';

/**
 * Enumerate the response event.
 */
export enum ResponseEvent {
  /**
   * Sign up event.
   */
  SIGN_UP = 'signUp',

  /**
   * Sign out event.
   */
  SIGN_OUT = 'signOut',
}

/**
 * Enumerate the response event string.
 */
export type ResponseEventString = 'SIGN_UP' | 'SIGN_OUT';
