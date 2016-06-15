/* global $ */
import Ember from 'ember';
import OpenApiModelExample from "npm:openapi-model-example";
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
    requestBody: "",
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

      for(let x=0; x< operation.parameters.length; x++){
          let parameter = operation.parameters[x];
          if(parameter.in === "body"){
              if(parameter.value){
                  this.set("requestBody", parameter.value);
              }else if(parameter.schema["$ref"]){
                  this.set("requestBody", OpenApiModelExample.getModelExample(parameter.schema["$ref"], this.get("apiService").api, false));
              }
          }else if(parameter.in === "header"){
              requestHeaders[parameter.name] = parameter.value;
          }

          if(parameter.in !== "body"){
              this.set("hasProperties", true);
          }
      }

      this.set("requestHeaders", requestHeaders);
      this.set('canSendData', operation.httpMethod === "post" || operation.httpMethod === "put" || operation.httpMethod === "patch" );

    },

    computedUrl: computed('operation.parameters.@each.value', function() {
        let operation = this.get('operation');
        let result = operation.uri;

        for(let x=0; x< operation.parameters.length; x++){
            let parameter = operation.parameters[x];

            if(parameter.in === "path" && parameter.value && parameter.value !== '' ){
                result = result.replace(`{${parameter.name}}`, parameter.value);
            }

            if(parameter.in === "query" &&
                parameter.value !== parameter.default &&
                (parameter.value !== "" && !parameter.required)){

                if(result.indexOf('?') === -1){
                    result += "?";
                }else{
                    result += "&";
                }

                result += `${parameter.name}=${parameter.value}`;
            }
            //result += parameter.name+ "= " + parameter.value + ", "
        }

        return result;
    }),

    computedHeaders: computed('operation.parameters.@each.value', function() {
        let requestHeaders = this.get('requestHeaders');
        let operation = this.get('operation');

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

    actions:{
        sendRequest(){
            this.set("hasResponse", false);
            this.set("hideRequest", false);
            let that= this;
            let apiService = this.get('apiService');
            let operation = this.get('operation');

            let url = apiService.api.schemes[0] + ":";

            if(apiService.api.host.indexOf("//") !== 0){
                url += "//";
            }

            url += apiService.api.host;

            if(apiService.api.basePath){
                url += apiService.api.basePath;
            }

            url += this.get("computedUrl");

            let requestParams = {
                method: operation.httpMethod,
                url: url,
                 timeout: 5000,
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
                requestParams.data = this.get("requestBody");
            }

            function parseHeaders(headerString){
                let headers = headerString.split('\n');
                let headerMap = [];


                for(var x=0; x<headers.length; x++){
                    let split = headers[x].split(':');
                    if(split[0]){
                        headerMap.push({
                            key: split[0].trim(),
                            value: split[1].trim()
                        });
                    }

                }

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
                }

                return response;
            }

            $.ajax(requestParams).success(function( data, textStatus, jqXHR  ) {
                that.set("hasResponse", true);
                that.set("hideRequest", true);
                that.set("response", handleResponse(jqXHR));
            }).error(function(jqXHR){
                that.set("hasResponse", true);
                that.set("hideRequest", true);
                that.set("response", handleResponse(jqXHR));
            });

        },
        share(){
            this.get("shareService").setSharableOperation(this.get("operation"), this.get("requestBody"), this.get("computedHeaders"), this.get("computedUrl"));
        }
    }
});
