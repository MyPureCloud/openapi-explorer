/* global $ */
import Ember from 'ember';
import OpenApiModelExample from "npm:openapi-model-example";
import config from '../config/environment';
var  computed = Ember.computed;

export default Ember.Component.extend({
    canSendData: true,
    apiService: Ember.inject.service('apiService'),
    authService: Ember.inject.service(),
    shareService: Ember.inject.service(),
    requestHeaders: {},
    hasResponse: false,
    hideRequest: false,
    hasProperties: false,
    response: {},
    operation: {},
    permissions: computed('operation', function(){
        let keyName = config.permissionsKeyName;
        let operation = this.get("operation");

        return operation[keyName];
    }),
    scopes: computed('operation', function(){
        let scopesKeyName = config.scopesKeyName;
        let operation = this.get("operation");
        if (operation['security'] && 
            operation['security'].length > 0 && 
            operation['security'][0][scopesKeyName]){
            return operation['security'][0][scopesKeyName];
        }
        return null;
    }),
    isPureCloudAuth: computed('operation', function(){
        let operation = this.get("operation");
        if (!operation.security || operation.security.length === 0) return false;
        return operation.security.any((security) => security['PureCloud OAuth'] !== undefined);
    }),
    aceInit: function(editor) {
        editor.setHighlightActiveLine(false);
        editor.setShowPrintMargin(false);
        editor.getSession().setTabSize(2);
        editor.getSession().setMode("ace/mode/javascript");
    },
    didReceiveAttrs() {
      this._super(...arguments);

      let operation = this.get('operation');
      let requestHeaders = this.get('requestHeaders');
      let authService = this.get("authService");

      requestHeaders['Content-Type'] = "application/json";

      if(authService.authHeader != null){
          requestHeaders['Authorization'] = '<HIDDEN>';
      }

      if(operation.parameters){
          for(let x=0; x< operation.parameters.length; x++){
              let parameter = operation.parameters[x];
              if(parameter.in === "body"){
                  if(typeof operation.requestBody === "undefined" || operation.requestBody === null || operation.requestBody.length === 0){
                      if(parameter.value){
                          operation.requestBody = parameter.value;
                      }else if(parameter.schema["$ref"]){
                          operation.requestBody = OpenApiModelExample.getModelExample(parameter.schema["$ref"], this.get("apiService").api, false);


                      }else if(parameter.schema.type === "array"){
                        // Override when type is array of string
                        if (parameter.schema.items && parameter.schema.items.type === 'string') {
                            operation.requestBody = '[""]';
                        } else {
                            operation.requestBody = '['+ OpenApiModelExample.getModelExample(parameter.schema.items['$ref'], this.get('apiService').api, false) +']';
                        }
                      }
                  }

                  if(parameter.schema["$ref"]){
                      this.set("requestBodyDefinition", OpenApiModelExample.getModelDescription(parameter.schema["$ref"], this.get("apiService").api, false));
                  }
              }else if(parameter.in === "header"){
                  requestHeaders[parameter.name] = parameter.value;
              }

              if(parameter.in !== "body"){
                  this.set("hasProperties", true);
              }
          }
      }


      this.set("requestHeaders", requestHeaders);
      this.set('canSendData', operation.httpMethod === "post" || operation.httpMethod === "put" || operation.httpMethod === "patch" );

    },

    computedUrl: computed('operation.parameters.@each.value', function() {
        let operation = this.get('operation');
        let result = operation.uri;

        if(operation.parameters){
            for(let x=0; x< operation.parameters.length; x++){
                let parameter = operation.parameters[x];

                if(parameter.in === "path" && parameter.value && parameter.value !== '' ){
                    result = result.replace(`{${parameter.name}}`, parameter.value);
                }

                if(parameter.in === "query" &&
                    parameter.value !== parameter.default &&
                    parameter.value !== ""){

                    if(result.indexOf('?') === -1){
                        result += "?";
                    }else{
                        result += "&";
                    }

                    result += `${parameter.name}=${encodeURIComponent(parameter.value)}`;
                }
                //result += parameter.name+ "= " + parameter.value + ", "
            }
        }


        return result;
    }),

    computedHeaders: computed('operation.parameters.@each.value', function() {
        let requestHeaders = this.get('requestHeaders');
        let operation = this.get('operation');

        if(operation.parameters){
            for(let x=0; x< operation.parameters.length; x++){
                let parameter = operation.parameters[x];

                if(parameter.in === "header" ){
                    if(parameter.value !== parameter.default &&
                        (parameter.value !== "" && !parameter.required)){

                        requestHeaders[parameter.name] = parameter.value;
                    }else{
                        delete requestHeaders[parameter.name];
                    }
                }
            }
        }

        this.set('requestHeaders', requestHeaders);

        let result = [];
        for (var key in requestHeaders) {
            result.push({
                key: key,
                value: requestHeaders[key]
            });

        }

        return result;
    }),
    _getUrlBase: function(){
        let apiService = this.get('apiService');

        let url = "http:";
        if(apiService.api.schemes){
            url = apiService.api.schemes[0] + ":";
        }

        if(apiService.api.host.indexOf("//") !== 0){
            url += "//";
        }

        url += apiService.api.host;

        if(apiService.api.basePath){
            url += apiService.api.basePath;
        }


        return url;
    },
    _persistParams(){

    },
    actions:{
        sendRequest(){
            this.set("hasResponse", false);
            this.set("hideRequest", false);
            let that= this;

            let operation = this.get('operation');

            let url = this._getUrlBase() + this.get("computedUrl");

            let requestParams = {
                method: operation.httpMethod,
                url: url,
                 timeout: 16000,
                headers:{

                }
            };

            let computedHeaders = this.get("computedHeaders");
            for(let x=0; x< computedHeaders.length; x++){
                let header = computedHeaders[x];

                requestParams.headers[header.key] = header.value;

                if(header.key === "Authorization"){
                    requestParams.headers[header.key] = this.get("authService").authHeader;
                }
            }
/*
            let authHeader = this.get("authService").authHeader;
            if(authHeader){
                requestParams.headers['Authorization'] = authHeader;
            }
*/
            if(this.get("canSendData")){
                let operation = this.get('operation');
                requestParams.data = operation.requestBody;
            }

            function parseHeaders(headerString){
                let headers = headerString.split('\n');
                let headerMap = [];


                for(var x=0; x<headers.length; x++){
                    let split = headers[x].split(':');
                    if(split[0] && split[1]){
                        headerMap.push({
                            key: split[0].trim(),
                            value: split[1].trim()
                        });
                    }

                }

                headerMap.sort(function compare(a, b) {
                            return a.key.localeCompare(b.key);
                        });

                return headerMap;
            }

            function handleResponse(xhResponse){

                let responseData = xhResponse.responseText;

                try{
                    if(xhResponse.getResponseHeader("Content-Type") === "application/json"){
                        responseData = JSON.stringify(JSON.parse(xhResponse.responseText), null, "  ");
                    }
                }catch(err){}


                let response = {
                    headers: parseHeaders(xhResponse.getAllResponseHeaders()),
                    data: responseData,
                    status : xhResponse.status,
                    statusText : xhResponse.statusText,
                    responseCodeClass: xhResponse.status.toString()[0]

                };

                console.log("correlationId " + xhResponse.getResponseHeader("ININ-Correlation-Id"));

                if(xhResponse.status === 0){
                    response.statusText = "HTTP request was blocked by CORS.  Inspect the browser network tab for more information.";
                    response.data = "{}";
                }

                return response;
            }

            $.ajax(requestParams).then(function( data, textStatus, jqXHR  ) {
                that.set("hasResponse", true);
                that.set("hideRequest", true);
                that.set("response", handleResponse(jqXHR));
            }).catch(function(jqXHR){
                that.set("hasResponse", true);
                that.set("hideRequest", true);
                that.set("response", handleResponse(jqXHR));
            });

            window.parent.postMessage(JSON.stringify({
                    action: 'anaytics',
                    httpMethod: this.get('operation').httpMethod,
                    url: this.get('operation').uri
                }), "*");

            this.get('parentView').send('saveRequests', this.origContext);

        },
        share(){
            let operation = this.get('operation');
            this.get("shareService").setSharableOperation(this.get("operation"), operation.requestBody, this.get("computedHeaders"), this.get("computedUrl"), this._getUrlBase());
        }
    }
});
