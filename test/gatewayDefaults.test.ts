import * as assert from 'assert';
import {DEFAULTS as defaults, handleDefaults} from '../src/defaults';

describe('test/defaults.test.ts', () => {
  it('should set the global default parameters.', async () => {
    handleDefaults({
      headers: {
        'content-Type': 'application/json',
      },
    });

    assert(defaults.get('headers')['content-Type'] === 'application/json');
  });
});
