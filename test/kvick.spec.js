import test from 'ava';
import Kvick from '../dist/kvick';

const app = new Kvick;

test('should return hello from Kvick', (t) => {
  t.is(app.hello, 'Hello from Kvick');
});
