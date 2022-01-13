import {FetchOptions} from '@leaf-x/fetch';

/**
 * Handle default options.
 */
export interface HandleDefaultsOptions {
  /**
   * Request header information.
   */
  headers?: FetchOptions['headers'];
}

/**
 * Default value container.
 *
 * @param options Handle default options.
 */
export const DEFAULTS = new Map();

/**
 * Handle default values.
 *
 * @param options Handle default options.
 */
export const handleDefaults = (options: HandleDefaultsOptions) =>
  Object.keys(options).forEach(key =>
    DEFAULTS.set(key, options[key as keyof HandleDefaultsOptions])
  );
