import { moduleFor, test } from 'ember-qunit';


moduleFor('service:auth-service', 'Unit | Service | auth-service', {
    unit: true
});
/*
test('auth header should be null if hash is not set', function(assert) {
    let service = this.subject();
    service.init();
    assert.equal(null, service.authHeader);

});
*/
test('auth header should be pulled from hash', function(assert) {
    let hash = "#access_token=foo&token_type=auth";

    let service = this.subject();

    assert.equal(service.parseHash(hash), "auth foo");

});
