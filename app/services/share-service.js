/* global $*/
/* global LZString*/
/* global Clipboard*/
import Ember from 'ember';
import config from '../config/environment';

    //  http://localhost:4200/api-explorer/?share=N4IgDghgLgFiBcIDmBTKBVAzigTpkANCALZowD2AJgsmoSAK44CWNA9BGM2wG4BMbBtjz1IOCMQBqEADYMU+eKEioAyswBeKGnwDsoiKgByDYgCNcCAIxFm1RADNy5epnI4oAeRyVLiAIKqAMIgAL5EZlQAnjRhQA===
export default Ember.Service.extend(Ember.Evented,{
    querystringService: Ember.inject.service(),
    apiService: Ember.inject.service(),
    requestService: Ember.inject.service(),
    requestOperation: null,
    requestBody: null,
    sharableLink: null,
    includeAuthHeader: false,
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

        console.log(share);

        let operationString = JSON.stringify(share);
        $('#clipboard').val(operationString);
        console.log("uncompressed Length " + operationString.length);
        var compressed = LZString.compressToBase64(operationString);

        console.log("compressed Length " + compressed.length);
        console.log(compressed);

        let shareUrl = `${window.location.protocol}//${window.location.host}/?`;

        if(config.shareUrl){
            shareUrl = config.shareUrl;
        }

        let sharableLink = `${shareUrl}share=${compressed}`;
        this.set("sharableLink", sharableLink);
    },
    setSharableOperation(operation, requestBody,computedHeaders, computedUrl){

        this.set("requestBody", requestBody);
        this.set("requestOperation", operation);

        this.setSharableLink(operation,requestBody);
        this.setSharableCurl(operation,requestBody,  computedHeaders, computedUrl);

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
    init(){
        new Clipboard('.btn');

        let apiService = this.get("apiService");
        let swagger = apiService.api;

        this.get('requestOperation');
        this.get('includeAuthHeader');

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
    }
});
