/* global $ */
import Ember from 'ember';
import config from '../config/environment';

export default Ember.Service.extend({
    querystringService: Ember.inject.service(),
    api: {},
    methodsByTag:{},

    filteredMethodsByTag(tag, filter){
        let filteredMethods = [];
        let methods = this.get("methodsByTag")[tag];

        if(filter == null || filter === ""){
            return methods;
        }
        filter = filter.toLowerCase();

        for(let x=0; x<methods.length; x++){
            let method = methods[x];
            if(tag.toLowerCase().indexOf(filter)> -1 ||

                    method.summary.toLowerCase().indexOf(filter) > -1 ||
                    method.uri.toLowerCase().indexOf(filter) > -1){
                filteredMethods.push(method);
            }
        }

        return filteredMethods;
    },

    areAllMethodsFilteredOut(filter){
        if(filter == null || filter === ""){
            return false;
        }

        let methodsMap = this.get("methodsByTag");

        for(let key in methodsMap){

            if(key.toLowerCase().indexOf(filter.toLowerCase()) > -1){
                return false;
            }

            let methods = methodsMap[key];

            filter = filter.toLowerCase();

            for(let x=0; x<methods.length; x++){
                let method = methods[x];
                if(method.summary.toLowerCase().indexOf(filter) > -1||
                    method.uri.toLowerCase().indexOf(filter) > -1){
                    return false;
                }
            }
        }

        return true;
    },

    processSchema(schema, self){

        let host = this.get("querystringService").getParameter(window.location.search, "host");
        if(host){
            schema.host = host;
        }

        let scheme = this.get("querystringService").getParameter(window.location.search, "scheme");
        if(scheme){
            schema.schemes = [scheme];
        }

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

        self.set('methodsByTag', apis);

        self.set('api', schema);
    },
    init() {
        let that = this;
        let openApiUrl = config.defaultOpenApiUrl;

        let customUrl = this.get("querystringService").getParameter(window.location.search, "openApiUrl");
        if(customUrl){
            openApiUrl = customUrl;
        }

        function getSwagger(){
            try{
                // "https://api.mypurecloud.com/api/v2/docs/swagger"
                $.getJSON(openApiUrl).done(function(schema){
                    if ( (that.get('isDestroyed') || that.get('isDestroying')) ) {
                        return;
                    }

                    that.processSchema(schema, that);
                }).error(function(err){
                    if(err.status === 202){
                        Ember.run.later((function() {
                          //server doesn't have swagger yet, retry in 2s
                          getSwagger();
                        }), 2000);
                    }else{
                        console.error("error getting swagger");
                    }

                });
            }
            catch(error){
                console.error("ERROR"  + error);
            }
        }

        getSwagger();


    }

});
