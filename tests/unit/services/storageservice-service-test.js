import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

const apiServiceStub = Ember.Service.extend({
    api: {
        host: 'foo'
    }
});


moduleFor('service:storage-service', 'Unit | Service | storage-service', {
    integration: true,

    beforeEach: function () {
        this.register('service:api-service', apiServiceStub);
        this.inject.service('api-service', { as: 'api' });
    }
});

test('it should call localStorage if defined', function(assert) {
    let key = "foo";
    let value = "bar";

    window.localStorage = function(k,v){
        assert.equal(key, k);
        assert.equal(value, v);
    };

    let service = this.subject();
    assert.equal(null, service.localStorageSet(key, value));

});
