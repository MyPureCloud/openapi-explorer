import { eq } from 'openapi-explorer/helpers/eq';
import { module, test } from 'qunit';

module('Unit | Helper | eq');

test('it matches equal values', function(assert) {
  let result = eq([42, 42]);
  assert.ok(result);
});


test("it doesn't match different values", function(assert) {
  let result = eq([42, 43]);
  assert.equal(result, false);
});
