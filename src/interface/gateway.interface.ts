export interface GatewayOptions {
  /**
   * Gateway application key.
   */
  appKey: string;

  /**
   * Gateway application secret.
   */
  appSecret: string;

  /**
   * Gateway environment.
   *
   * Default RELEASE
   */
  stage: string;
}
