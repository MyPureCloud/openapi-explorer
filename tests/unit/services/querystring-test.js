import { moduleFor, test } from 'ember-qunit';

moduleFor('service:querystring-service', 'Unit | Service | querystring-service', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it should work with a query string', function(assert) {
  let service = this.subject();

  let queryString = "?foo=bar&hello=world";

  assert.equal("bar", service.getParameter(queryString, "foo"));
  assert.equal("world", service.getParameter(queryString, "hello"));
});

test('it should work with a hash', function(assert) {
  let service = this.subject();

  let queryString = "#foo=bar&hello=world";

  assert.equal("bar", service.getParameter(queryString, "foo"));
  assert.equal("world", service.getParameter(queryString, "hello"));
});

test('it should return null if not present', function(assert) {
  let service = this.subject();

  let queryString = "#foo=bar&hello=world";

  assert.equal(null, service.getParameter(queryString, "baz"));
});
