# OpenAPI Explorer
The OpenAPI explorer is a different take on Swagger UI and is a way to view a [OpenAPI/Swagger](http://swagger.io/) definition and execute API calls

## Specifying a Swagger Definition in the url

The Open API explorer accepts a couple URL parameters for configuration

| Param | Location | Description | Example |
| ----- | -------- | ----------- | ------- |
| openApiUrl | query string | The Url to the open api definition file | https://api.mypurecloud.com/api/v2/docs/swagger |
| host | query string | Overrides the _host_ value in the swagger file  | localhost:8080 |
| schema | query string | Overrides the _schema_ value in the swagger file  | http |
| token_type | url hash | oauth token type to use with authenticated requests | bearer |
| access_token | url hash | oauth access token |  |

token_type and access_token are in the url hash to support oauth redirects.

Assuming that the OpenAPI explorer is hosted at https://developer.mypurecloud.com/openapi-explorer/, an example would be:

https://developer.mypurecloud.com/openapi-explorer/?openApiUrl=https://api.mypurecloud.com/api/v2/docs/swagger#token_type=bearer&access_token=Uf7UTEjT9SknXhdUz

## Restrictions

* Currently only supports OAuth2 bearer tokens

## Environment Variable Configuration

| Env Var | Description |
| ------- | ----------- |
| PERMISSIONS_KEY_NAME | property on method to get permission information, permission model looks like ``` { "type": "ANY/ALL", "permissions": [list of permission names]} ``` |
