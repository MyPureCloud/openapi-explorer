/*jshint -W117 */
import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

const swagger = '{"paths":{"/pet":{"post":{"tags":["pet"],"summary":"Add a new pet to the store","description":"","operationId":"addPet","consumes":["application/json","application/xml"],"produces":["application/xml","application/json"],"parameters":[{"in":"body","name":"body","description":"Pet object that needs to be added to the store","required":true,"schema":{"$ref":"#/definitions/Pet"}}],"responses":{"405":{"description":"Invalid input"}},"security":[{"petstore_auth":["write:pets","read:pets"]}]}}},"externalDocs":{"description":"Find out more about Swagger","url":"http://swagger.io"}}';

const apiServiceStub = Ember.Service.extend({
    api: JSON.parse(swagger)
});

const querystringServiceStub = Ember.Service.extend({
    getParameter: function(){
        return null;
    }
});

moduleFor('service:share-service', 'Unit | Service | share-service', {
    unit: true,

    beforeEach: function () {
        this.register('service:api-service', apiServiceStub);
        this.inject.service('api-service', { as: 'api' });

        this.register('service:querystring-service', querystringServiceStub);
        this.inject.service('querystring-service', { as: 'querystring' });
    }
});


test('it should set sharable curl', function(assert) {
    let operation  = {
        httpMethod: "GET"
    };

    let url = "http://someurl";

    let service = this.subject();
    let headers = [
        {key:"foo", value:"bar"},
        {key:"Authorization", value:"baz"}
    ];

    service.setSharableCurl(operation, null, headers, url);

    assert.ok(service.get("sharableCurl").indexOf("curl -X GET") > -1);
    assert.ok(service.get("sharableCurl").indexOf('-H "foo: bar"') > -1);
    assert.ok(service.get("sharableCurl").indexOf("baz") === -1);
    assert.ok(service.get("sharableCurl").indexOf(url) > -1);
});

test('it should set sharable curl with Body', function(assert) {
    let operation  = {
        httpMethod: "GET"
    };

    let service = this.subject();
    let body = "SOME BODY";

    service.setSharableCurl(operation, body, [], "");

    assert.ok(service.get("sharableCurl").indexOf("-d 'SOME BODY'") > -1);
});

test('it should set sharable link', function(assert) {
    LZString = {
        compressToBase64: function(string){
            return string;
        },
        decompressFromBase64: function(string){
            return string;
        }
    };
    let operation  = {
        httpMethod: "post",
        operationId: "addPet",
        uri: "/pet"
    };

    let service = this.subject();
    let body = "SOME BODY";

    service.setSharableLink(operation, body);

    let sharableLink = service.get("sharableLink");

    assert.ok(sharableLink.indexOf("/?share=") > -1);

    let parsedShare = service.parseShare(sharableLink.split('?')[1].replace("share=",''));

    assert.equal(parsedShare.httpMethod, operation.httpMethod);
    assert.equal(parsedShare.operationId, operation.operationId);

    assert.equal(parsedShare.parameters[0].value, body);

});
