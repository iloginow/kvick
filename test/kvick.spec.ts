import { describe, it } from 'mocha';
import { assert } from 'chai';

import Kvick from '../src/Kvick';

const app = new Kvick();

describe('Kvick', () => {
  describe('hello', () => {
    it('should return hello from kvick', () => {
      assert.equal(app.hello(), 'Hello from Kvick');
    });
  });
});
