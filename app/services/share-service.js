/* global $*/
/* global LZString*/
/* global Clipboard*/
import Ember from 'ember';

    //  http://localhost:4200/api-explorer/?share=N4IgDghgLgFiBcIDmBTKBVAzigTpkANCALZowD2AJgsmoSAK44CWNA9BGM2wG4BMbBtjz1IOCMQBqEADYMU+eKEioAyswBeKGnwDsoiKgByDYgCNcCAIxFm1RADNy5epnI4oAeRyVLiAIKqAMIgAL5EZlQAnjRhQA===
export default Ember.Service.extend(Ember.Evented,{
    querystringService: Ember.inject.service(),
    apiService: Ember.inject.service(),
    requestService: Ember.inject.service(),
    requestOperation: null,
    requestBody: null,
    sharableLink: null,
    includeAuthHeader: false,
    apiChanged: Ember.observer('apiService.api', function() {
        console.log("api changed do share");
        this.doShare();
    }),
    setSharableLink(operation, requestBody){
        let share = {
            path: operation.operationId,
            method: operation.httpMethod,
            uri: operation.uri,
            paramValues: {}
        };

        for(let x=0; x< operation.parameters.length; x++){
            let param = operation.parameters[x];
            share.paramValues[param.name] = param.value;
        }

        share.paramValues['body'] = requestBody;

        let operationString = JSON.stringify(share);
        $('#clipboard').val(operationString);
        var compressed = LZString.compressToBase64(operationString);

        let shareUrl = `${window.location.protocol}//${window.location.host}/?`;

        let queryStringSharedUrl = this.get("querystringService").getParameter(window.location.search, "shareUrl");

        if(queryStringSharedUrl){
            shareUrl = decodeURIComponent(queryStringSharedUrl);
        }

        let sharableLink = `${shareUrl}share=${compressed}`;
        this.set("sharableLink", sharableLink);
    },
    setSharableOperation(operation, requestBody,computedHeaders, computedUrl, urlBase){

        this.set("requestBody", requestBody);
        this.set("requestOperation", operation);

        this.setSharableLink(operation,requestBody);
        this.setSharableCurl(operation,requestBody,  computedHeaders, urlBase + computedUrl);

    },
    setSharableCurl(operation, requestBody, computedHeaders, computedUrl){

        let includeAuthHeader = this.get('includeAuthHeader');

        let curl = `curl -X ${operation.httpMethod} `;

        for(let x=0; x< computedHeaders.length; x++){
            let param = computedHeaders[x];
            if(param.key === "Authorization" && !includeAuthHeader){
                curl += `-H "${param.key}: INSERT AUTH HEADER" `;
            }else{
                curl += `-H "${param.key}: ${param.value}" `;
            }

        }

        if(requestBody && requestBody.length > 0){
            curl += `-d '${requestBody}' `;
        }

        curl += `"${computedUrl}"`;
        this.set("sharableCurl", curl);
    },
    doShare(){
        let apiService = this.get("apiService");
        let swagger = apiService.api;

        if(swagger == null || swagger.paths == null){
            return;
        }

        let share = this.get("querystringService").getParameter(window.location.search, "share");

        if(share){
            try{
                let sharedOperation = JSON.parse(LZString.decompressFromBase64(share));

                let operation = JSON.parse(JSON.stringify(swagger.paths[sharedOperation.uri][sharedOperation.method]));

                for(let x=0; x< operation.parameters.length; x++){
                    let param = operation.parameters[x];
                    if(sharedOperation.paramValues[param.name]){
                        param.value = sharedOperation.paramValues[param.name];
                    }
                }

                operation.operationId = sharedOperation.path;
                operation.httpMethod = sharedOperation.method;

                this.get("requestService").newRequest(operation);

            }catch(ex){
                console.error("ERROR getting shared operation ");
                console.error(ex);
            }
        }
    },
    init(){
        new Clipboard('.btn');

        this.get('requestOperation');
        this.get('includeAuthHeader');

        this.doShare();
    }
});
