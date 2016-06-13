/* global $ */
import Ember from 'ember';

export default Ember.Service.extend({
    openApiDefinition: null,
    api: {},
    methodsByTag:{},

    init() {
        let that = this;
        try{
            // "https://api.mypurecloud.com/api/v2/docs/swagger"
            //$.getJSON("https://api.inindca.com/api/v2/docs/swagger").done(function(schema){
            $.getJSON("http://petstore.swagger.io/v2/swagger.json").done(function(schema){
                let paths = schema.paths;

                let apis = {};

                for(var uri in paths){
                    for (var httpMethod in paths[uri]){
                        for(var x =0; x<  paths[uri][httpMethod].tags.length; x++){
                            let tag = paths[uri][httpMethod].tags[x];
                            if(apis[tag] == null){
                                apis[tag] = [];
                            }
                            let method = paths[uri][httpMethod];
                            method.httpMethod = httpMethod;
                            method.uri = uri;
                            apis[tag].push(method);
                        }
                    }
                }

                that.set('methodsByTag', apis);

                that.set('api', schema);
            }).error(function(){
                console.error("error getting swagger");
            });
        }
        catch(error){
            console.error("ERROR"  + error);
        }

    }

});
